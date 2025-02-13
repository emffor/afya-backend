import { faker } from '@faker-js/faker/locale/pt_BR';
import * as mongoose from 'mongoose';
import { ProductSchema } from './src/product/product.schema';
import { CategorySchema } from './src/category/category.schema';
import { OrderSchema } from './src/order/order.schema';

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/afyadb';
    await mongoose.connect(mongoUri);
    console.log(`Conectado ao MongoDB em: ${mongoUri}`);

    if (!mongoose.connection.db) {
      throw new Error('Não foi possível estabelecer conexão com o banco de dados.');
    }

    console.log('Limpando dados antigos...');
    await mongoose.connection.db.dropDatabase();

    const categoriesData = Array(5).fill(null).map(() => ({
      name: faker.commerce.department(),
      description: faker.commerce.productDescription()
    }));

    const CategoryModel = mongoose.model('Category', CategorySchema);
    let createdCategories: any[] = [];
    try {
      createdCategories = await CategoryModel.insertMany(categoriesData);
      console.log('Categorias criadas:', createdCategories);
    } catch (error) {
      console.error('Erro ao criar categorias:', error);
    }

    const productsData = Array(10).fill(null).map(() => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: Number(faker.commerce.price({ min: 10, max: 1000 })),
      category: faker.helpers.arrayElement(createdCategories)?._id,
      imageUrl: faker.image.url()
    }));

    const ProductModel = mongoose.model('Product', ProductSchema);
    let createdProducts: any[] = [];
    try {
      createdProducts = await ProductModel.insertMany(productsData);
      console.log('Produtos criados:', createdProducts);
    } catch (error) {
      console.error('Erro ao criar produtos:', error);
    }

    const ordersData = Array(8).fill(null).map(() => {
      const selectedProducts = faker.helpers.arrayElements(
        createdProducts.map(p => p._id),
        { min: 1, max: 3 }
      );
      
      const total = selectedProducts.reduce((acc, productId) => {
        const product = createdProducts.find(p => p._id.toString() === productId.toString());
        return acc + (product ? product.price : 0);
      }, 0);

      return {
        products: selectedProducts,
        total: total,
        orderDate: faker.date.between({
          from: '2023-01-01',
          to: new Date()
        })
      };
    });

    const OrderModel = mongoose.model('Order', OrderSchema);
    let createdOrders: any[] = [];
    try {
      createdOrders = await OrderModel.insertMany(ordersData);
      console.log('Pedidos criados:', createdOrders);
    } catch (error) {
      console.error('Erro ao criar pedidos:', error);
    }

    console.log('Seed concluído.');
    process.exit(0);
  } catch (error) {
    console.error('Erro no seed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  }
}

seed();