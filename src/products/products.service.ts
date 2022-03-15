import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto, ProductPaginator } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductT } from './entities/product.entity';
import { paginate } from 'src/common/pagination/paginate';
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
const options = {
  keys: ['name', 'type.slug', 'categories.slug', 'status', 'shop_id'],
  threshold: 0.3,
};
@Injectable()
export class ProductsService {
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
      for (let g_image of createProductDto?.gallery) {
        delete g_image.id;
        await this.prductGalaeyRepository.save({
          ...g_image,
          product: product,
        });
      }
      // createProductDto?.gallery.map(async (g_image) => {
      //   delete g_image.id;
      //   await this.prductGalaeyRepository.save({
      //     ...g_image,
      //     product: product,
      //   });
      // });
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
    const date = new Date();
    product.created_at = date;
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
    const related_products = await this.productRepository.find();
    // .filter((p) => p.type.slug === product.type.slug)
    // .slice(0, 20);

    return {
      ...product,
      related_products,
    };
  }
  async getProductById(id: string) {
    const product = await this.productRepository.findOne(id).catch((err) => {
      console.log(err);
    });

    return {
      ...product,
    };
  }
  async getPopularProducts({ shop_id, limit }: GetPopularProductsDto) {
    // return this.products?.slice(0, limit);
    return await this.productRepository.find();
  }

  async updatee(id: number, updateProductDto: UpdateProductDto) {
    console.log(updateProductDto);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    let product = await this.productRepository.findOne({ id: id });
    product.name = updateProductDto?.name;
    product.slug = updateProductDto?.name + 'slug';
    product.description = updateProductDto?.description;
    product.height = updateProductDto?.height;
    product.length = updateProductDto?.length;
    product.sku = updateProductDto?.sku;
    product.status = updateProductDto?.status;
    product.unit = updateProductDto?.unit;
    product.width = updateProductDto?.width;
    product.quantity = updateProductDto?.quantity;
    product.product_type = updateProductDto?.product_type;
    product.type_id = updateProductDto?.type_id;
    product.shop_id = updateProductDto?.shop_id;
    product.price = updateProductDto?.price;
    product.sale_price = updateProductDto?.sale_price;
    product = await this.productRepository.save(product);

    if (updateProductDto?.image) {
      let image;
      delete updateProductDto?.image.id;
      const imagedb = await this.prductImageRepository.find({
        product: product,
      });
      if (imagedb) {
        image = await this.prductImageRepository.update(
          {
            product: product,
          },
          {
            ...updateProductDto?.image,
            product: product,
          },
        );
      } else {
        image = await this.prductImageRepository.save({
          ...updateProductDto.image,
          product: product,
        });
      }
    }

    if (updateProductDto?.gallery) {
      const oldGallery = await this.prductGalaeyRepository.find({
        product: product,
      });
      for (let old of oldGallery) {
        await this.prductGalaeyRepository.remove(old);
      }
      product = await this.productRepository.save(product);
      let galleries = [];
      for (let pic of updateProductDto?.gallery) {
        let gallery = new ProductGallery();
        gallery.thumbnail = pic.thumbnail;
        gallery.original = pic.original;
        await this.prductGalaeyRepository.save(gallery);
        galleries.push(gallery);
      }
      product.gallery = galleries;
      await this.productRepository.save(product);
    }

    if (updateProductDto?.shop_id) {
      const shop = await this.shopRepository.findOne({
        id: updateProductDto?.shop_id,
      });
      product.shop = shop;
    }
    if (updateProductDto?.type_id) {
      const type = await this.typeRepository.findOne({
        id: updateProductDto?.type_id,
      });
      product.type = type;
    }
    await this.productRepository.save(product);

    if (updateProductDto?.categories) {
      const oldCat = product.categories?.map((cat) => cat.id);
      for (let cat_id of oldCat) {
        await getConnection()
          .createQueryBuilder()
          .relation(ProductT, 'categories')
          .of(product)
          .remove(cat_id);
      }
      for (let cat_id of updateProductDto?.categories) {
        await getConnection()
          .createQueryBuilder()
          .relation(ProductT, 'categories')
          .of(product)
          .add(cat_id);
      }
    }

    if (updateProductDto?.tags) {
      const oldTags = product.tags.map((tag) => tag.id);
      oldTags.map(async (tag_id) => {
        await getConnection()
          .createQueryBuilder()
          .relation(ProductT, 'tags')
          .of(product)
          .remove(tag_id);
      });
      updateProductDto?.tags.map(async (tag_id) => {
        await getConnection()
          .createQueryBuilder()
          .relation(ProductT, 'tags')
          .of(product)
          .add(tag_id);
      });
    }
    return product;
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne(id);
    return await this.productRepository.remove(product);
  }
}
