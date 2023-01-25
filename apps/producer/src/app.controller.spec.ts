import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ImageService } from './detection/image.service';

describe('AppController', () => {
  let appController: AppController;
  let imageService: ImageService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
      controllers: [AppController],
      providers: [ImageService],
    }).compile();

    appController = app.get<AppController>(AppController);
    imageService = app.get<ImageService>(ImageService);
  });

  describe('putImage', () => {
    it('should return success true and url', async () => {
      const url = 'https://image.com';
      const respUrl = 'https://image.com';
      jest
        .spyOn(imageService, 'addImage')
        .mockImplementation(() => Promise.resolve(respUrl));

      const result = await appController.putImage({ url });

      expect(result).toEqual({ success: true, respUrl });
      expect(imageService.addImage).toHaveBeenCalledWith(url);
    });

    it('should return success false if addImage throws an error', async () => {
      const url = 'https://image.com';
      jest
        .spyOn(imageService, 'addImage')
        .mockImplementation(() => Promise.resolve(false));

      const result = await appController.putImage({ url });

      expect(result).toEqual({ success: false });
      expect(imageService.addImage).toHaveBeenCalledWith(url);
    });
  });
});
