import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto, ProductPaginator } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductT } from './entities/product.entity';
import { paginate } from 'src/common/pagination/paginate';
import productsJson from './products.json';
import Fuse from 'fuse.js';
import { GetPopularProductsDto } from './dto/get-popular-products.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository, getConnection } from 'typeorm';
import {
  ProductAttachment,
  ProductGallery,
} from 'src/common/entities/attachment.entity';
import { ShopT } from 'src/shops/entities/shop.entity';
import { TypeT } from 'src/types/entities/type.entity';
const products = plainToClass(Product, productsJson);
const options = {
  keys: ['name', 'type.slug', 'categories.slug', 'status', 'shop_id'],
  threshold: 0.3,
};
@Injectable()
export class ProductsService {
  private products: Product[] = products;
  constructor(
    @InjectRepository(ProductT) private productRepository: Repository<ProductT>,
  ) {}
  prductImageRepository = getRepository(ProductAttachment);
  prductGalaeyRepository = getRepository(ProductGallery);
  shopRepository = getRepository(ShopT);
  typeRepository = getRepository(TypeT);
  async create(createProductDto: CreateProductDto) {
    const product = new ProductT();
    product.name = createProductDto?.name;
    product.slug = createProductDto?.name + 'slug';
    product.description = createProductDto?.description;
    product.height = createProductDto?.height;
    product.length = createProductDto?.length;
    product.sku = createProductDto?.sku;
    product.status = createProductDto?.status;
    product.unit = createProductDto?.unit;
    product.width = createProductDto?.width;
    product.quantity = createProductDto?.quantity;
    product.product_type = createProductDto?.product_type;
    product.type_id = createProductDto?.type_id;
    product.shop_id = createProductDto?.shop_id;
    product.price = createProductDto?.price;
    product.sale_price = createProductDto?.sale_price;
    await this.productRepository.save(product);

    if (createProductDto?.image) {
      delete createProductDto?.image.id;
      await this.prductImageRepository.save({
        ...createProductDto?.image,
        product: product,
      });
    }

    if (createProductDto?.gallery) {
      createProductDto?.gallery.map(async (g_image) => {
        delete g_image.id;
        await this.prductGalaeyRepository.save({
          ...g_image,
          product: product,
        });
      });
    }
    if (createProductDto?.shop_id) {
      const shop = await this.shopRepository.findOne({
        id: createProductDto?.shop_id,
      });
      product.shop = shop;
    }
    if (createProductDto?.type_id) {
      const type = await this.typeRepository.findOne({
        id: createProductDto?.type_id,
      });
      product.type = type;
    }
    await this.productRepository.save(product);
    if (createProductDto?.categories) {
      createProductDto?.categories.map(async (categories_id) => {
        await getConnection()
          .createQueryBuilder()
          .relation(ProductT, 'categories')
          .of(product)
          .add(categories_id);
      });
    }
    if (createProductDto?.tags) {
      createProductDto?.tags.map(async (tag_id) => {
        await getConnection()
          .createQueryBuilder()
          .relation(ProductT, 'tags')
          .of(product)
          .add(tag_id);
      });
    }
    return product;
  }

  async getProducts({
    limit,
    page,
    search,
  }: GetProductsDto): Promise<ProductPaginator> {
    if (!page) page = 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: ProductT[] = await this.productRepository.find();
    const fuse = new Fuse(data, options);
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }
    // if (status) {
    //   data = fuse.search(status)?.map(({ item }) => item);
    // }
    // if (text?.replace(/%/g, '')) {
    //   data = fuse.search(text)?.map(({ item }) => item);
    // }
    // if (hasType) {
    //   data = fuse.search(hasType)?.map(({ item }) => item);
    // }
    // if (hasCategories) {
    //   data = fuse.search(hasCategories)?.map(({ item }) => item);
    // }

    // if (shop_id) {
    //   data = this.products.filter((p) => p.shop_id === Number(shop_id));
    // }
    let results = data.slice(startIndex, endIndex);
    results = data;
    const url = `/products?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getProductBySlug(slug: string) {
    const product = await this.productRepository
      .findOne({ slug: slug })
      .catch((err) => {
        console.log(err);
      });
    const related_products = this.products
      // .filter((p) => p.type.slug === product.type.slug)
      .slice(0, 20);
    return {
      ...product,
      related_products,
    };
  }
  getPopularProducts({ shop_id, limit }: GetPopularProductsDto): Product[] {
    return this.products?.slice(0, limit);
  }
  update(id: number, updateProductDto: UpdateProductDto) {
    return this.products[0];
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne(id);
    return await this.productRepository.remove(product);
  }
}
