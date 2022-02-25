import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsModule } from './cats/cats.module';
import { AllExceptionsFilter } from './common/exception/all-exceptions.filter';
import { RolesGuard } from './common/guard/roles.guard';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CustomValitationPipe } from './common/pipe/custom-validate.pipe';
import { MessagesModule } from './message/messages.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'admin',
      // 数据名字
      database: 'blog',
      // 加载实体文件方式一
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // 加载实体文件方式二
      autoLoadEntities: true,
      // 代表是否自动将实体类同步到数据库
      synchronize: true
    }),
    CatsModule,
    MessagesModule,
    UserModule
  ],
  /**
   * * 一般全局的 provide 的正常的执行顺序是:
   * 中间件 -> 守卫 -> 拦截器 -> 管道 -> 控制器 -> 拦截器 -> 返回结果
   *
   * ? 如果在中间夹杂着局部的拦截器是会是这样的顺序
   * 中间件 -> 守卫 -> 拦截器(全局) -> 拦截器(局部) -> 管道 -> 控制器 -> 拦截器(局部) -> 拦截器(全局部) -> 返回结果
   *
   * ? 思考如果有局部的守卫和管道,那么执行顺序会是什么样的呢
   * 中间件 -> 守卫(全局) -> 守卫(局部) -> 拦截器 -> 管道 -> 控制器 -> 拦截器 -> 返回结果
   * 中间件 -> 守卫 -> 拦截器 -> 管道(全局) -> 管道(局部) -> 控制器 -> 拦截器 -> 返回结果
   * ! 没有测试 我猜应该是这样....
   *
   * ? 如果发生了异常会是这样子的
   * 在任何一个了步骤发生了异常,就不会走下面的流程了,会直接把异常返回
   */
  providers: [
    /**
     * * 守卫在每个中间件之后执行，但在任何拦截器或管道之前执行。
     * 守卫是一个使用 @Injectable() 装饰器的类。 守卫应该实现 CanActivate 接口
     *
     * 守卫有一个单独的责任。
     * 它们根据运行时出现的某些条件（例如权限，角色，访问控制列表等）来确定给定的请求是否由路由处理程 序处理。
     * 这通常称为授权。在传统的 Express 应用程序中，通常由中间件处理授权。
     * 中间件是身份验证的良好选择。
     * 到目前为止，访问限制逻辑大多在中间件内。
     * 这样很好，因为诸如 token 验证或将 request 对象附加属性与特定路由没有强关联。
     * 中间件不知道调用 next() 函数后会执行哪个处理程序。
     * 另一方面，守卫可以访问 ExecutionContext 实例，因此确切地知道接下来要执行什么。
     * 它们的设计与异常过滤器、管道和拦截器非常相似，目的是让您在请求/响应周期的正确位置插入处理逻辑，并以声明的方式进行插入。
     * 这有助于保持代码的简洁和声明性。
     */
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    /**
     * * 拦截器分为2段，第一段在守卫完成之后执行，next()里面的是第二段，在controller完成之后执行
     * 拦截器是使用 @Injectable() 装饰器注解的类。拦截器应该实现 NestInterceptor 接口。
     * 拦截器具有一系列有用的功能，这些功能受面向切面编程（AOP）技术的启发。它们可以：
     * - 在函数执行之前/之后绑定额外的逻辑
     * - 转换从函数返回的结果
     * - 转换从函数抛出的异常
     * - 扩展基本函数行为
     * - 根据所选条件完全重写函数 (例如, 缓存目的)
     */
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    // 第四个
    /**
     * * 管道在拦截器第一段完成之后执行
     *
     * 管道是具有 @Injectable() 装饰器的类。管道应实现 PipeTransform 接口。
     * 管道有两个类型:
     * - 转换：管道将输入数据转换为所需的数据输出
     * - 验证：对输入数据进行验证，如果验证成功继续传递; 验证失败则抛出异常;
     *
     * * 一般管道完成之后，返回 true 就会进入controller里面了 如果是 false 就直接返回了
     */
    {
      provide: APP_PIPE,
      useClass: CustomValitationPipe
    },
    /**
     * * 异常 如果有的话则不会进入controll。直接返回结果,并且不会走下面的流程
     *
     * 内置的异常层负责处理整个应用程序中的所有抛出的异常。
     * 当捕获到未处理的异常时，最终用户将收到友好的响应。
     */
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    /**
     * * 中间件是在路由处理程序 之前 调用的函数。
     * 中间件函数可以访问请求和响应对象，以及应用程序请求响应周期中的 next() 中间件函数。
     * next() 中间件函数通常由名为 next 的变量表示。
     *
     * 中间件函数可以执行以下任务:
     * - 执行任何代码。
     * - 对请求和响应对象进行更改。
     * - 结束请求-响应周期。
     * - 调用堆栈中的下一个中间件函数。
     * - 如果当前的中间件函数没有结束请求-响应周期, 它必须调用 next() 将控制传递给下一个中间件函数。
     *   否则, 请求将被挂起。
     *
     * forRoutes('') 可以针对所有路由，或者单个路由 forRoutes('cats');
     */
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
