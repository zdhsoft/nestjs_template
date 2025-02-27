import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

function test() {
    const a = {
        name: 'rex',
        age: 25,
        address: {
            city: 'Beijing',
        },
    };

    console.log(a.address.city);

    const b = 1;
    const cc = 2;
    const ddd = 5;

    console.log(b + cc + ddd);
}

test();
