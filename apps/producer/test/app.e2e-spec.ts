import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { fetchBuffer } from '@libs';
import { AppModule } from '../src/app.module';
import * as amqplib from 'amqplib';
import { setTimeout as sleep } from 'node:timers/promises';
let app: NestFastifyApplication;
let connection: amqplib.Connection | null = null;
beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );

  await app.init();
  await app.getHttpAdapter().getInstance().ready();
  connection = await amqplib.connect(process.env.rabbitMqURL);
});

it(`/image/upload (PUT) with explicit image`, async () => {
  return app
    .inject({
      method: 'PUT',
      url: '/image/upload',
      payload: {
        // don't open this link if you are under 18
        url: 'https://img-cf.xvideos-cdn.com/videos/thumbs169poster/ce/7a/3d/ce7a3d0e10cdf7f257b3c8ed8f1ac853/ce7a3d0e10cdf7f257b3c8ed8f1ac853.28.jpg',
      },
    })
    .then(async (result) => {
      const respUrl: string = JSON.parse(result.body).respUrl;
      expect(respUrl).toBeTruthy();
      expect(new URL(respUrl)).toBeInstanceOf(URL);
      await sleep(2000);
      const buffer = await fetchBuffer(respUrl).catch(() => null);
      expect(buffer).toBe(null);
    });
});

it(`/image/upload (PUT) without explicit image (space image)`, async () => {
  return app
    .inject({
      method: 'PUT',
      url: '/image/upload',
      payload: {
        // space image
        url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80',
      },
    })
    .then(async (result) => {
      const respUrl: string = JSON.parse(result.body).respUrl;
      expect(respUrl).toBeTruthy();
      expect(new URL(respUrl)).toBeInstanceOf(URL);
      await sleep(2000);
      const buffer = await fetchBuffer(respUrl).catch(() => null);
      expect(buffer).toBeInstanceOf(Buffer);
    });
});

it(`/image/upload (PUT) with explicit image but allowed type (underwear pic)`, async () => {
  return app
    .inject({
      method: 'PUT',
      url: '/image/upload',
      payload: {
        // underwear pic
        url: 'https://images-cdn.ubuy.co.in/634e3b570d3522558633b8e3-hanes-womens-super-value-cotton-brief.jpg',
      },
    })
    .then(async (result) => {
      const respUrl: string = JSON.parse(result.body).respUrl;
      expect(respUrl).toBeTruthy();
      expect(new URL(respUrl)).toBeInstanceOf(URL);
      await sleep(2000);
      const buffer = await fetchBuffer(respUrl).catch(() => null);
      expect(buffer).toBeInstanceOf(Buffer);
    });
});

it(`/image/upload (PUT) with explicit image but allowed type (tobacco pic)`, async () => {
  return app
    .inject({
      method: 'PUT',
      url: '/image/upload',
      payload: {
        // tobacco pic
        url: 'https://www.verywellmind.com/thmb/K9SUBAyGXpbp1wVZ2UsSbbTfKeM=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/smoking-reasons-5762b8f93df78c98dc2cb099.jpg',
      },
    })
    .then(async (result) => {
      const respUrl: string = JSON.parse(result.body).respUrl;
      expect(respUrl).toBeTruthy();
      expect(new URL(respUrl)).toBeInstanceOf(URL);
      await sleep(2000);
      const buffer = await fetchBuffer(respUrl).catch(() => null);
      expect(buffer).toBeInstanceOf(Buffer);
    });
});

it(`/image/upload (PUT) with explicit image but allowed type (gore pic)`, async () => {
  return app
    .inject({
      method: 'PUT',
      url: '/image/upload',
      payload: {
        // gore pic, don't open if you are sensitive
        url: 'https://www.dailyexcelsior.com/wp-content/uploads/2021/05/page9-1-3.jpg',
      },
    })
    .then(async (result) => {
      const respUrl: string = JSON.parse(result.body).respUrl;
      expect(respUrl).toBeTruthy();
      expect(new URL(respUrl)).toBeInstanceOf(URL);
      await sleep(2000);
      const buffer = await fetchBuffer(respUrl).catch(() => null);
      expect(buffer).toBe(null);
    });
});

afterAll(async () => {
  await app.close();
  await connection?.close();
});
