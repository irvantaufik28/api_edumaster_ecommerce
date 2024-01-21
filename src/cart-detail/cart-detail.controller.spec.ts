import { Test, TestingModule } from '@nestjs/testing';
import { CartDetailController } from './cart-detail.controller';

describe('CartDetailController', () => {
  let controller: CartDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartDetailController],
    }).compile();

    controller = module.get<CartDetailController>(CartDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
