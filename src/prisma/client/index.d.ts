
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Users
 * 
 */
export type Users = $Result.DefaultSelection<Prisma.$UsersPayload>
/**
 * Model Limits
 * 
 */
export type Limits = $Result.DefaultSelection<Prisma.$LimitsPayload>
/**
 * Model Servers
 * 
 */
export type Servers = $Result.DefaultSelection<Prisma.$ServersPayload>
/**
 * Model PremiumSubscriptions
 * 
 */
export type PremiumSubscriptions = $Result.DefaultSelection<Prisma.$PremiumSubscriptionsPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Plans: {
  FREE: 'FREE',
  PREMIUM: 'PREMIUM',
  PREMIUMPLUS: 'PREMIUMPLUS',
  PRO: 'PRO'
};

export type Plans = (typeof Plans)[keyof typeof Plans]


export const LogLevel: {
  NONE: 'NONE',
  MINIMAL: 'MINIMAL',
  MEDIUM: 'MEDIUM',
  MAXIMUM: 'MAXIMUM'
};

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel]


export const Sources: {
  DISCORD: 'DISCORD',
  DASHBOARD: 'DASHBOARD'
};

export type Sources = (typeof Sources)[keyof typeof Sources]

}

export type Plans = $Enums.Plans

export const Plans: typeof $Enums.Plans

export type LogLevel = $Enums.LogLevel

export const LogLevel: typeof $Enums.LogLevel

export type Sources = $Enums.Sources

export const Sources: typeof $Enums.Sources

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.users.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.users.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.users`: Exposes CRUD operations for the **Users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.UsersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.limits`: Exposes CRUD operations for the **Limits** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Limits
    * const limits = await prisma.limits.findMany()
    * ```
    */
  get limits(): Prisma.LimitsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.servers`: Exposes CRUD operations for the **Servers** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Servers
    * const servers = await prisma.servers.findMany()
    * ```
    */
  get servers(): Prisma.ServersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.premiumSubscriptions`: Exposes CRUD operations for the **PremiumSubscriptions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PremiumSubscriptions
    * const premiumSubscriptions = await prisma.premiumSubscriptions.findMany()
    * ```
    */
  get premiumSubscriptions(): Prisma.PremiumSubscriptionsDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Users: 'Users',
    Limits: 'Limits',
    Servers: 'Servers',
    PremiumSubscriptions: 'PremiumSubscriptions'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "users" | "limits" | "servers" | "premiumSubscriptions"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Users: {
        payload: Prisma.$UsersPayload<ExtArgs>
        fields: Prisma.UsersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          findFirst: {
            args: Prisma.UsersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          findMany: {
            args: Prisma.UsersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>[]
          }
          create: {
            args: Prisma.UsersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          createMany: {
            args: Prisma.UsersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>[]
          }
          delete: {
            args: Prisma.UsersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          update: {
            args: Prisma.UsersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          deleteMany: {
            args: Prisma.UsersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>[]
          }
          upsert: {
            args: Prisma.UsersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.UsersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
      Limits: {
        payload: Prisma.$LimitsPayload<ExtArgs>
        fields: Prisma.LimitsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LimitsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LimitsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LimitsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LimitsPayload>
          }
          findFirst: {
            args: Prisma.LimitsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LimitsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LimitsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LimitsPayload>
          }
          findMany: {
            args: Prisma.LimitsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LimitsPayload>[]
          }
          create: {
            args: Prisma.LimitsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LimitsPayload>
          }
          createMany: {
            args: Prisma.LimitsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LimitsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LimitsPayload>[]
          }
          delete: {
            args: Prisma.LimitsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LimitsPayload>
          }
          update: {
            args: Prisma.LimitsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LimitsPayload>
          }
          deleteMany: {
            args: Prisma.LimitsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LimitsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LimitsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LimitsPayload>[]
          }
          upsert: {
            args: Prisma.LimitsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LimitsPayload>
          }
          aggregate: {
            args: Prisma.LimitsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLimits>
          }
          groupBy: {
            args: Prisma.LimitsGroupByArgs<ExtArgs>
            result: $Utils.Optional<LimitsGroupByOutputType>[]
          }
          count: {
            args: Prisma.LimitsCountArgs<ExtArgs>
            result: $Utils.Optional<LimitsCountAggregateOutputType> | number
          }
        }
      }
      Servers: {
        payload: Prisma.$ServersPayload<ExtArgs>
        fields: Prisma.ServersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ServersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServersPayload>
          }
          findFirst: {
            args: Prisma.ServersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServersPayload>
          }
          findMany: {
            args: Prisma.ServersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServersPayload>[]
          }
          create: {
            args: Prisma.ServersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServersPayload>
          }
          createMany: {
            args: Prisma.ServersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ServersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServersPayload>[]
          }
          delete: {
            args: Prisma.ServersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServersPayload>
          }
          update: {
            args: Prisma.ServersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServersPayload>
          }
          deleteMany: {
            args: Prisma.ServersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ServersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ServersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServersPayload>[]
          }
          upsert: {
            args: Prisma.ServersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServersPayload>
          }
          aggregate: {
            args: Prisma.ServersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateServers>
          }
          groupBy: {
            args: Prisma.ServersGroupByArgs<ExtArgs>
            result: $Utils.Optional<ServersGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServersCountArgs<ExtArgs>
            result: $Utils.Optional<ServersCountAggregateOutputType> | number
          }
        }
      }
      PremiumSubscriptions: {
        payload: Prisma.$PremiumSubscriptionsPayload<ExtArgs>
        fields: Prisma.PremiumSubscriptionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PremiumSubscriptionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumSubscriptionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PremiumSubscriptionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumSubscriptionsPayload>
          }
          findFirst: {
            args: Prisma.PremiumSubscriptionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumSubscriptionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PremiumSubscriptionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumSubscriptionsPayload>
          }
          findMany: {
            args: Prisma.PremiumSubscriptionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumSubscriptionsPayload>[]
          }
          create: {
            args: Prisma.PremiumSubscriptionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumSubscriptionsPayload>
          }
          createMany: {
            args: Prisma.PremiumSubscriptionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PremiumSubscriptionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumSubscriptionsPayload>[]
          }
          delete: {
            args: Prisma.PremiumSubscriptionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumSubscriptionsPayload>
          }
          update: {
            args: Prisma.PremiumSubscriptionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumSubscriptionsPayload>
          }
          deleteMany: {
            args: Prisma.PremiumSubscriptionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PremiumSubscriptionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PremiumSubscriptionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumSubscriptionsPayload>[]
          }
          upsert: {
            args: Prisma.PremiumSubscriptionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumSubscriptionsPayload>
          }
          aggregate: {
            args: Prisma.PremiumSubscriptionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePremiumSubscriptions>
          }
          groupBy: {
            args: Prisma.PremiumSubscriptionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<PremiumSubscriptionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.PremiumSubscriptionsCountArgs<ExtArgs>
            result: $Utils.Optional<PremiumSubscriptionsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    users?: UsersOmit
    limits?: LimitsOmit
    servers?: ServersOmit
    premiumSubscriptions?: PremiumSubscriptionsOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UsersCountOutputType
   */

  export type UsersCountOutputType = {
    premiumServers: number
  }

  export type UsersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    premiumServers?: boolean | UsersCountOutputTypeCountPremiumServersArgs
  }

  // Custom InputTypes
  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsersCountOutputType
     */
    select?: UsersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountPremiumServersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServersWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersMinAggregateOutputType = {
    id: string | null
    username: string | null
    email: string | null
    extId: string | null
    discordId: string | null
    plan: $Enums.Plans | null
  }

  export type UsersMaxAggregateOutputType = {
    id: string | null
    username: string | null
    email: string | null
    extId: string | null
    discordId: string | null
    plan: $Enums.Plans | null
  }

  export type UsersCountAggregateOutputType = {
    id: number
    username: number
    email: number
    extId: number
    discordId: number
    plan: number
    _all: number
  }


  export type UsersMinAggregateInputType = {
    id?: true
    username?: true
    email?: true
    extId?: true
    discordId?: true
    plan?: true
  }

  export type UsersMaxAggregateInputType = {
    id?: true
    username?: true
    email?: true
    extId?: true
    discordId?: true
    plan?: true
  }

  export type UsersCountAggregateInputType = {
    id?: true
    username?: true
    email?: true
    extId?: true
    discordId?: true
    plan?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to aggregate.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type UsersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsersWhereInput
    orderBy?: UsersOrderByWithAggregationInput | UsersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: UsersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    id: string
    username: string
    email: string | null
    extId: string | null
    discordId: string
    plan: $Enums.Plans
    _count: UsersCountAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends UsersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type UsersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    extId?: boolean
    discordId?: boolean
    plan?: boolean
    premiumSubscriptions?: boolean | Users$premiumSubscriptionsArgs<ExtArgs>
    limits?: boolean | Users$limitsArgs<ExtArgs>
    premiumServers?: boolean | Users$premiumServersArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>

  export type UsersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    extId?: boolean
    discordId?: boolean
    plan?: boolean
  }, ExtArgs["result"]["users"]>

  export type UsersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    extId?: boolean
    discordId?: boolean
    plan?: boolean
  }, ExtArgs["result"]["users"]>

  export type UsersSelectScalar = {
    id?: boolean
    username?: boolean
    email?: boolean
    extId?: boolean
    discordId?: boolean
    plan?: boolean
  }

  export type UsersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "email" | "extId" | "discordId" | "plan", ExtArgs["result"]["users"]>
  export type UsersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    premiumSubscriptions?: boolean | Users$premiumSubscriptionsArgs<ExtArgs>
    limits?: boolean | Users$limitsArgs<ExtArgs>
    premiumServers?: boolean | Users$premiumServersArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UsersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UsersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UsersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Users"
    objects: {
      premiumSubscriptions: Prisma.$PremiumSubscriptionsPayload<ExtArgs> | null
      limits: Prisma.$LimitsPayload<ExtArgs> | null
      premiumServers: Prisma.$ServersPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      email: string | null
      extId: string | null
      discordId: string
      plan: $Enums.Plans
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type UsersGetPayload<S extends boolean | null | undefined | UsersDefaultArgs> = $Result.GetResult<Prisma.$UsersPayload, S>

  type UsersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface UsersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Users'], meta: { name: 'Users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {UsersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsersFindUniqueArgs>(args: SelectSubset<T, UsersFindUniqueArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsersFindUniqueOrThrowArgs>(args: SelectSubset<T, UsersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsersFindFirstArgs>(args?: SelectSubset<T, UsersFindFirstArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsersFindFirstOrThrowArgs>(args?: SelectSubset<T, UsersFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsersFindManyArgs>(args?: SelectSubset<T, UsersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {UsersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends UsersCreateArgs>(args: SelectSubset<T, UsersCreateArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UsersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsersCreateManyArgs>(args?: SelectSubset<T, UsersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UsersCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsersCreateManyAndReturnArgs>(args?: SelectSubset<T, UsersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Users.
     * @param {UsersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends UsersDeleteArgs>(args: SelectSubset<T, UsersDeleteArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {UsersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsersUpdateArgs>(args: SelectSubset<T, UsersUpdateArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UsersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsersDeleteManyArgs>(args?: SelectSubset<T, UsersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsersUpdateManyArgs>(args: SelectSubset<T, UsersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UsersUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsersUpdateManyAndReturnArgs>(args: SelectSubset<T, UsersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Users.
     * @param {UsersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends UsersUpsertArgs>(args: SelectSubset<T, UsersUpsertArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UsersCountArgs>(
      args?: Subset<T, UsersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsersGroupByArgs['orderBy'] }
        : { orderBy?: UsersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Users model
   */
  readonly fields: UsersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    premiumSubscriptions<T extends Users$premiumSubscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, Users$premiumSubscriptionsArgs<ExtArgs>>): Prisma__PremiumSubscriptionsClient<$Result.GetResult<Prisma.$PremiumSubscriptionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    limits<T extends Users$limitsArgs<ExtArgs> = {}>(args?: Subset<T, Users$limitsArgs<ExtArgs>>): Prisma__LimitsClient<$Result.GetResult<Prisma.$LimitsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    premiumServers<T extends Users$premiumServersArgs<ExtArgs> = {}>(args?: Subset<T, Users$premiumServersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Users model
   */
  interface UsersFieldRefs {
    readonly id: FieldRef<"Users", 'String'>
    readonly username: FieldRef<"Users", 'String'>
    readonly email: FieldRef<"Users", 'String'>
    readonly extId: FieldRef<"Users", 'String'>
    readonly discordId: FieldRef<"Users", 'String'>
    readonly plan: FieldRef<"Users", 'Plans'>
  }
    

  // Custom InputTypes
  /**
   * Users findUnique
   */
  export type UsersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users findUniqueOrThrow
   */
  export type UsersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users findFirst
   */
  export type UsersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * Users findFirstOrThrow
   */
  export type UsersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * Users findMany
   */
  export type UsersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * Users create
   */
  export type UsersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * The data needed to create a Users.
     */
    data: XOR<UsersCreateInput, UsersUncheckedCreateInput>
  }

  /**
   * Users createMany
   */
  export type UsersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UsersCreateManyInput | UsersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Users createManyAndReturn
   */
  export type UsersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UsersCreateManyInput | UsersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Users update
   */
  export type UsersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * The data needed to update a Users.
     */
    data: XOR<UsersUpdateInput, UsersUncheckedUpdateInput>
    /**
     * Choose, which Users to update.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users updateMany
   */
  export type UsersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UsersUpdateManyMutationInput, UsersUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UsersWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * Users updateManyAndReturn
   */
  export type UsersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UsersUpdateManyMutationInput, UsersUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UsersWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * Users upsert
   */
  export type UsersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * The filter to search for the Users to update in case it exists.
     */
    where: UsersWhereUniqueInput
    /**
     * In case the Users found by the `where` argument doesn't exist, create a new Users with this data.
     */
    create: XOR<UsersCreateInput, UsersUncheckedCreateInput>
    /**
     * In case the Users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsersUpdateInput, UsersUncheckedUpdateInput>
  }

  /**
   * Users delete
   */
  export type UsersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter which Users to delete.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users deleteMany
   */
  export type UsersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UsersWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * Users.premiumSubscriptions
   */
  export type Users$premiumSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumSubscriptions
     */
    select?: PremiumSubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PremiumSubscriptions
     */
    omit?: PremiumSubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PremiumSubscriptionsInclude<ExtArgs> | null
    where?: PremiumSubscriptionsWhereInput
  }

  /**
   * Users.limits
   */
  export type Users$limitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Limits
     */
    select?: LimitsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Limits
     */
    omit?: LimitsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LimitsInclude<ExtArgs> | null
    where?: LimitsWhereInput
  }

  /**
   * Users.premiumServers
   */
  export type Users$premiumServersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servers
     */
    select?: ServersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servers
     */
    omit?: ServersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServersInclude<ExtArgs> | null
    where?: ServersWhereInput
    orderBy?: ServersOrderByWithRelationInput | ServersOrderByWithRelationInput[]
    cursor?: ServersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ServersScalarFieldEnum | ServersScalarFieldEnum[]
  }

  /**
   * Users without action
   */
  export type UsersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
  }


  /**
   * Model Limits
   */

  export type AggregateLimits = {
    _count: LimitsCountAggregateOutputType | null
    _avg: LimitsAvgAggregateOutputType | null
    _sum: LimitsSumAggregateOutputType | null
    _min: LimitsMinAggregateOutputType | null
    _max: LimitsMaxAggregateOutputType | null
  }

  export type LimitsAvgAggregateOutputType = {
    aiUsed: number | null
    aiLimit: number | null
    additionalMessages: number | null
    premiumServers: number | null
    premiumServerLimmit: number | null
  }

  export type LimitsSumAggregateOutputType = {
    aiUsed: number | null
    aiLimit: number | null
    additionalMessages: number | null
    premiumServers: number | null
    premiumServerLimmit: number | null
  }

  export type LimitsMinAggregateOutputType = {
    id: string | null
    date: Date | null
    aiUsed: number | null
    aiLimit: number | null
    additionalMessages: number | null
    premiumServers: number | null
    premiumServerLimmit: number | null
  }

  export type LimitsMaxAggregateOutputType = {
    id: string | null
    date: Date | null
    aiUsed: number | null
    aiLimit: number | null
    additionalMessages: number | null
    premiumServers: number | null
    premiumServerLimmit: number | null
  }

  export type LimitsCountAggregateOutputType = {
    id: number
    date: number
    aiUsed: number
    aiLimit: number
    additionalMessages: number
    premiumServers: number
    premiumServerLimmit: number
    _all: number
  }


  export type LimitsAvgAggregateInputType = {
    aiUsed?: true
    aiLimit?: true
    additionalMessages?: true
    premiumServers?: true
    premiumServerLimmit?: true
  }

  export type LimitsSumAggregateInputType = {
    aiUsed?: true
    aiLimit?: true
    additionalMessages?: true
    premiumServers?: true
    premiumServerLimmit?: true
  }

  export type LimitsMinAggregateInputType = {
    id?: true
    date?: true
    aiUsed?: true
    aiLimit?: true
    additionalMessages?: true
    premiumServers?: true
    premiumServerLimmit?: true
  }

  export type LimitsMaxAggregateInputType = {
    id?: true
    date?: true
    aiUsed?: true
    aiLimit?: true
    additionalMessages?: true
    premiumServers?: true
    premiumServerLimmit?: true
  }

  export type LimitsCountAggregateInputType = {
    id?: true
    date?: true
    aiUsed?: true
    aiLimit?: true
    additionalMessages?: true
    premiumServers?: true
    premiumServerLimmit?: true
    _all?: true
  }

  export type LimitsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Limits to aggregate.
     */
    where?: LimitsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Limits to fetch.
     */
    orderBy?: LimitsOrderByWithRelationInput | LimitsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LimitsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Limits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Limits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Limits
    **/
    _count?: true | LimitsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LimitsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LimitsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LimitsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LimitsMaxAggregateInputType
  }

  export type GetLimitsAggregateType<T extends LimitsAggregateArgs> = {
        [P in keyof T & keyof AggregateLimits]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLimits[P]>
      : GetScalarType<T[P], AggregateLimits[P]>
  }




  export type LimitsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LimitsWhereInput
    orderBy?: LimitsOrderByWithAggregationInput | LimitsOrderByWithAggregationInput[]
    by: LimitsScalarFieldEnum[] | LimitsScalarFieldEnum
    having?: LimitsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LimitsCountAggregateInputType | true
    _avg?: LimitsAvgAggregateInputType
    _sum?: LimitsSumAggregateInputType
    _min?: LimitsMinAggregateInputType
    _max?: LimitsMaxAggregateInputType
  }

  export type LimitsGroupByOutputType = {
    id: string
    date: Date
    aiUsed: number
    aiLimit: number
    additionalMessages: number
    premiumServers: number
    premiumServerLimmit: number
    _count: LimitsCountAggregateOutputType | null
    _avg: LimitsAvgAggregateOutputType | null
    _sum: LimitsSumAggregateOutputType | null
    _min: LimitsMinAggregateOutputType | null
    _max: LimitsMaxAggregateOutputType | null
  }

  type GetLimitsGroupByPayload<T extends LimitsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LimitsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LimitsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LimitsGroupByOutputType[P]>
            : GetScalarType<T[P], LimitsGroupByOutputType[P]>
        }
      >
    >


  export type LimitsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    aiUsed?: boolean
    aiLimit?: boolean
    additionalMessages?: boolean
    premiumServers?: boolean
    premiumServerLimmit?: boolean
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["limits"]>

  export type LimitsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    aiUsed?: boolean
    aiLimit?: boolean
    additionalMessages?: boolean
    premiumServers?: boolean
    premiumServerLimmit?: boolean
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["limits"]>

  export type LimitsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    aiUsed?: boolean
    aiLimit?: boolean
    additionalMessages?: boolean
    premiumServers?: boolean
    premiumServerLimmit?: boolean
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["limits"]>

  export type LimitsSelectScalar = {
    id?: boolean
    date?: boolean
    aiUsed?: boolean
    aiLimit?: boolean
    additionalMessages?: boolean
    premiumServers?: boolean
    premiumServerLimmit?: boolean
  }

  export type LimitsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "aiUsed" | "aiLimit" | "additionalMessages" | "premiumServers" | "premiumServerLimmit", ExtArgs["result"]["limits"]>
  export type LimitsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }
  export type LimitsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }
  export type LimitsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }

  export type $LimitsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Limits"
    objects: {
      user: Prisma.$UsersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      date: Date
      aiUsed: number
      aiLimit: number
      additionalMessages: number
      premiumServers: number
      premiumServerLimmit: number
    }, ExtArgs["result"]["limits"]>
    composites: {}
  }

  type LimitsGetPayload<S extends boolean | null | undefined | LimitsDefaultArgs> = $Result.GetResult<Prisma.$LimitsPayload, S>

  type LimitsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LimitsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LimitsCountAggregateInputType | true
    }

  export interface LimitsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Limits'], meta: { name: 'Limits' } }
    /**
     * Find zero or one Limits that matches the filter.
     * @param {LimitsFindUniqueArgs} args - Arguments to find a Limits
     * @example
     * // Get one Limits
     * const limits = await prisma.limits.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LimitsFindUniqueArgs>(args: SelectSubset<T, LimitsFindUniqueArgs<ExtArgs>>): Prisma__LimitsClient<$Result.GetResult<Prisma.$LimitsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Limits that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LimitsFindUniqueOrThrowArgs} args - Arguments to find a Limits
     * @example
     * // Get one Limits
     * const limits = await prisma.limits.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LimitsFindUniqueOrThrowArgs>(args: SelectSubset<T, LimitsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LimitsClient<$Result.GetResult<Prisma.$LimitsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Limits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LimitsFindFirstArgs} args - Arguments to find a Limits
     * @example
     * // Get one Limits
     * const limits = await prisma.limits.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LimitsFindFirstArgs>(args?: SelectSubset<T, LimitsFindFirstArgs<ExtArgs>>): Prisma__LimitsClient<$Result.GetResult<Prisma.$LimitsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Limits that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LimitsFindFirstOrThrowArgs} args - Arguments to find a Limits
     * @example
     * // Get one Limits
     * const limits = await prisma.limits.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LimitsFindFirstOrThrowArgs>(args?: SelectSubset<T, LimitsFindFirstOrThrowArgs<ExtArgs>>): Prisma__LimitsClient<$Result.GetResult<Prisma.$LimitsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Limits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LimitsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Limits
     * const limits = await prisma.limits.findMany()
     * 
     * // Get first 10 Limits
     * const limits = await prisma.limits.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const limitsWithIdOnly = await prisma.limits.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LimitsFindManyArgs>(args?: SelectSubset<T, LimitsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LimitsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Limits.
     * @param {LimitsCreateArgs} args - Arguments to create a Limits.
     * @example
     * // Create one Limits
     * const Limits = await prisma.limits.create({
     *   data: {
     *     // ... data to create a Limits
     *   }
     * })
     * 
     */
    create<T extends LimitsCreateArgs>(args: SelectSubset<T, LimitsCreateArgs<ExtArgs>>): Prisma__LimitsClient<$Result.GetResult<Prisma.$LimitsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Limits.
     * @param {LimitsCreateManyArgs} args - Arguments to create many Limits.
     * @example
     * // Create many Limits
     * const limits = await prisma.limits.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LimitsCreateManyArgs>(args?: SelectSubset<T, LimitsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Limits and returns the data saved in the database.
     * @param {LimitsCreateManyAndReturnArgs} args - Arguments to create many Limits.
     * @example
     * // Create many Limits
     * const limits = await prisma.limits.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Limits and only return the `id`
     * const limitsWithIdOnly = await prisma.limits.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LimitsCreateManyAndReturnArgs>(args?: SelectSubset<T, LimitsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LimitsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Limits.
     * @param {LimitsDeleteArgs} args - Arguments to delete one Limits.
     * @example
     * // Delete one Limits
     * const Limits = await prisma.limits.delete({
     *   where: {
     *     // ... filter to delete one Limits
     *   }
     * })
     * 
     */
    delete<T extends LimitsDeleteArgs>(args: SelectSubset<T, LimitsDeleteArgs<ExtArgs>>): Prisma__LimitsClient<$Result.GetResult<Prisma.$LimitsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Limits.
     * @param {LimitsUpdateArgs} args - Arguments to update one Limits.
     * @example
     * // Update one Limits
     * const limits = await prisma.limits.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LimitsUpdateArgs>(args: SelectSubset<T, LimitsUpdateArgs<ExtArgs>>): Prisma__LimitsClient<$Result.GetResult<Prisma.$LimitsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Limits.
     * @param {LimitsDeleteManyArgs} args - Arguments to filter Limits to delete.
     * @example
     * // Delete a few Limits
     * const { count } = await prisma.limits.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LimitsDeleteManyArgs>(args?: SelectSubset<T, LimitsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Limits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LimitsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Limits
     * const limits = await prisma.limits.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LimitsUpdateManyArgs>(args: SelectSubset<T, LimitsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Limits and returns the data updated in the database.
     * @param {LimitsUpdateManyAndReturnArgs} args - Arguments to update many Limits.
     * @example
     * // Update many Limits
     * const limits = await prisma.limits.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Limits and only return the `id`
     * const limitsWithIdOnly = await prisma.limits.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LimitsUpdateManyAndReturnArgs>(args: SelectSubset<T, LimitsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LimitsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Limits.
     * @param {LimitsUpsertArgs} args - Arguments to update or create a Limits.
     * @example
     * // Update or create a Limits
     * const limits = await prisma.limits.upsert({
     *   create: {
     *     // ... data to create a Limits
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Limits we want to update
     *   }
     * })
     */
    upsert<T extends LimitsUpsertArgs>(args: SelectSubset<T, LimitsUpsertArgs<ExtArgs>>): Prisma__LimitsClient<$Result.GetResult<Prisma.$LimitsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Limits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LimitsCountArgs} args - Arguments to filter Limits to count.
     * @example
     * // Count the number of Limits
     * const count = await prisma.limits.count({
     *   where: {
     *     // ... the filter for the Limits we want to count
     *   }
     * })
    **/
    count<T extends LimitsCountArgs>(
      args?: Subset<T, LimitsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LimitsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Limits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LimitsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LimitsAggregateArgs>(args: Subset<T, LimitsAggregateArgs>): Prisma.PrismaPromise<GetLimitsAggregateType<T>>

    /**
     * Group by Limits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LimitsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LimitsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LimitsGroupByArgs['orderBy'] }
        : { orderBy?: LimitsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LimitsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLimitsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Limits model
   */
  readonly fields: LimitsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Limits.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LimitsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UsersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsersDefaultArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Limits model
   */
  interface LimitsFieldRefs {
    readonly id: FieldRef<"Limits", 'String'>
    readonly date: FieldRef<"Limits", 'DateTime'>
    readonly aiUsed: FieldRef<"Limits", 'Int'>
    readonly aiLimit: FieldRef<"Limits", 'Int'>
    readonly additionalMessages: FieldRef<"Limits", 'Int'>
    readonly premiumServers: FieldRef<"Limits", 'Int'>
    readonly premiumServerLimmit: FieldRef<"Limits", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Limits findUnique
   */
  export type LimitsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Limits
     */
    select?: LimitsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Limits
     */
    omit?: LimitsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LimitsInclude<ExtArgs> | null
    /**
     * Filter, which Limits to fetch.
     */
    where: LimitsWhereUniqueInput
  }

  /**
   * Limits findUniqueOrThrow
   */
  export type LimitsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Limits
     */
    select?: LimitsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Limits
     */
    omit?: LimitsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LimitsInclude<ExtArgs> | null
    /**
     * Filter, which Limits to fetch.
     */
    where: LimitsWhereUniqueInput
  }

  /**
   * Limits findFirst
   */
  export type LimitsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Limits
     */
    select?: LimitsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Limits
     */
    omit?: LimitsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LimitsInclude<ExtArgs> | null
    /**
     * Filter, which Limits to fetch.
     */
    where?: LimitsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Limits to fetch.
     */
    orderBy?: LimitsOrderByWithRelationInput | LimitsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Limits.
     */
    cursor?: LimitsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Limits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Limits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Limits.
     */
    distinct?: LimitsScalarFieldEnum | LimitsScalarFieldEnum[]
  }

  /**
   * Limits findFirstOrThrow
   */
  export type LimitsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Limits
     */
    select?: LimitsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Limits
     */
    omit?: LimitsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LimitsInclude<ExtArgs> | null
    /**
     * Filter, which Limits to fetch.
     */
    where?: LimitsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Limits to fetch.
     */
    orderBy?: LimitsOrderByWithRelationInput | LimitsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Limits.
     */
    cursor?: LimitsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Limits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Limits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Limits.
     */
    distinct?: LimitsScalarFieldEnum | LimitsScalarFieldEnum[]
  }

  /**
   * Limits findMany
   */
  export type LimitsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Limits
     */
    select?: LimitsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Limits
     */
    omit?: LimitsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LimitsInclude<ExtArgs> | null
    /**
     * Filter, which Limits to fetch.
     */
    where?: LimitsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Limits to fetch.
     */
    orderBy?: LimitsOrderByWithRelationInput | LimitsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Limits.
     */
    cursor?: LimitsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Limits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Limits.
     */
    skip?: number
    distinct?: LimitsScalarFieldEnum | LimitsScalarFieldEnum[]
  }

  /**
   * Limits create
   */
  export type LimitsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Limits
     */
    select?: LimitsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Limits
     */
    omit?: LimitsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LimitsInclude<ExtArgs> | null
    /**
     * The data needed to create a Limits.
     */
    data: XOR<LimitsCreateInput, LimitsUncheckedCreateInput>
  }

  /**
   * Limits createMany
   */
  export type LimitsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Limits.
     */
    data: LimitsCreateManyInput | LimitsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Limits createManyAndReturn
   */
  export type LimitsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Limits
     */
    select?: LimitsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Limits
     */
    omit?: LimitsOmit<ExtArgs> | null
    /**
     * The data used to create many Limits.
     */
    data: LimitsCreateManyInput | LimitsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LimitsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Limits update
   */
  export type LimitsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Limits
     */
    select?: LimitsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Limits
     */
    omit?: LimitsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LimitsInclude<ExtArgs> | null
    /**
     * The data needed to update a Limits.
     */
    data: XOR<LimitsUpdateInput, LimitsUncheckedUpdateInput>
    /**
     * Choose, which Limits to update.
     */
    where: LimitsWhereUniqueInput
  }

  /**
   * Limits updateMany
   */
  export type LimitsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Limits.
     */
    data: XOR<LimitsUpdateManyMutationInput, LimitsUncheckedUpdateManyInput>
    /**
     * Filter which Limits to update
     */
    where?: LimitsWhereInput
    /**
     * Limit how many Limits to update.
     */
    limit?: number
  }

  /**
   * Limits updateManyAndReturn
   */
  export type LimitsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Limits
     */
    select?: LimitsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Limits
     */
    omit?: LimitsOmit<ExtArgs> | null
    /**
     * The data used to update Limits.
     */
    data: XOR<LimitsUpdateManyMutationInput, LimitsUncheckedUpdateManyInput>
    /**
     * Filter which Limits to update
     */
    where?: LimitsWhereInput
    /**
     * Limit how many Limits to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LimitsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Limits upsert
   */
  export type LimitsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Limits
     */
    select?: LimitsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Limits
     */
    omit?: LimitsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LimitsInclude<ExtArgs> | null
    /**
     * The filter to search for the Limits to update in case it exists.
     */
    where: LimitsWhereUniqueInput
    /**
     * In case the Limits found by the `where` argument doesn't exist, create a new Limits with this data.
     */
    create: XOR<LimitsCreateInput, LimitsUncheckedCreateInput>
    /**
     * In case the Limits was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LimitsUpdateInput, LimitsUncheckedUpdateInput>
  }

  /**
   * Limits delete
   */
  export type LimitsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Limits
     */
    select?: LimitsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Limits
     */
    omit?: LimitsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LimitsInclude<ExtArgs> | null
    /**
     * Filter which Limits to delete.
     */
    where: LimitsWhereUniqueInput
  }

  /**
   * Limits deleteMany
   */
  export type LimitsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Limits to delete
     */
    where?: LimitsWhereInput
    /**
     * Limit how many Limits to delete.
     */
    limit?: number
  }

  /**
   * Limits without action
   */
  export type LimitsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Limits
     */
    select?: LimitsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Limits
     */
    omit?: LimitsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LimitsInclude<ExtArgs> | null
  }


  /**
   * Model Servers
   */

  export type AggregateServers = {
    _count: ServersCountAggregateOutputType | null
    _min: ServersMinAggregateOutputType | null
    _max: ServersMaxAggregateOutputType | null
  }

  export type ServersMinAggregateOutputType = {
    id: string | null
    name: string | null
    ownerId: string | null
    isPremium: boolean | null
    premiumAddedBy: string | null
    aiEnabled: boolean | null
    welcomeChannel: string | null
    announcementChannel: string | null
    updatesChannel: string | null
    logsChannel: string | null
    logLevel: $Enums.LogLevel | null
  }

  export type ServersMaxAggregateOutputType = {
    id: string | null
    name: string | null
    ownerId: string | null
    isPremium: boolean | null
    premiumAddedBy: string | null
    aiEnabled: boolean | null
    welcomeChannel: string | null
    announcementChannel: string | null
    updatesChannel: string | null
    logsChannel: string | null
    logLevel: $Enums.LogLevel | null
  }

  export type ServersCountAggregateOutputType = {
    id: number
    name: number
    ownerId: number
    isPremium: number
    premiumAddedBy: number
    aiEnabled: number
    welcomeChannel: number
    announcementChannel: number
    updatesChannel: number
    logsChannel: number
    logLevel: number
    _all: number
  }


  export type ServersMinAggregateInputType = {
    id?: true
    name?: true
    ownerId?: true
    isPremium?: true
    premiumAddedBy?: true
    aiEnabled?: true
    welcomeChannel?: true
    announcementChannel?: true
    updatesChannel?: true
    logsChannel?: true
    logLevel?: true
  }

  export type ServersMaxAggregateInputType = {
    id?: true
    name?: true
    ownerId?: true
    isPremium?: true
    premiumAddedBy?: true
    aiEnabled?: true
    welcomeChannel?: true
    announcementChannel?: true
    updatesChannel?: true
    logsChannel?: true
    logLevel?: true
  }

  export type ServersCountAggregateInputType = {
    id?: true
    name?: true
    ownerId?: true
    isPremium?: true
    premiumAddedBy?: true
    aiEnabled?: true
    welcomeChannel?: true
    announcementChannel?: true
    updatesChannel?: true
    logsChannel?: true
    logLevel?: true
    _all?: true
  }

  export type ServersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Servers to aggregate.
     */
    where?: ServersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servers to fetch.
     */
    orderBy?: ServersOrderByWithRelationInput | ServersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Servers
    **/
    _count?: true | ServersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServersMaxAggregateInputType
  }

  export type GetServersAggregateType<T extends ServersAggregateArgs> = {
        [P in keyof T & keyof AggregateServers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServers[P]>
      : GetScalarType<T[P], AggregateServers[P]>
  }




  export type ServersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServersWhereInput
    orderBy?: ServersOrderByWithAggregationInput | ServersOrderByWithAggregationInput[]
    by: ServersScalarFieldEnum[] | ServersScalarFieldEnum
    having?: ServersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServersCountAggregateInputType | true
    _min?: ServersMinAggregateInputType
    _max?: ServersMaxAggregateInputType
  }

  export type ServersGroupByOutputType = {
    id: string
    name: string
    ownerId: string
    isPremium: boolean
    premiumAddedBy: string | null
    aiEnabled: boolean
    welcomeChannel: string | null
    announcementChannel: string | null
    updatesChannel: string
    logsChannel: string | null
    logLevel: $Enums.LogLevel
    _count: ServersCountAggregateOutputType | null
    _min: ServersMinAggregateOutputType | null
    _max: ServersMaxAggregateOutputType | null
  }

  type GetServersGroupByPayload<T extends ServersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ServersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServersGroupByOutputType[P]>
            : GetScalarType<T[P], ServersGroupByOutputType[P]>
        }
      >
    >


  export type ServersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ownerId?: boolean
    isPremium?: boolean
    premiumAddedBy?: boolean
    aiEnabled?: boolean
    welcomeChannel?: boolean
    announcementChannel?: boolean
    updatesChannel?: boolean
    logsChannel?: boolean
    logLevel?: boolean
    premiumUser?: boolean | Servers$premiumUserArgs<ExtArgs>
  }, ExtArgs["result"]["servers"]>

  export type ServersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ownerId?: boolean
    isPremium?: boolean
    premiumAddedBy?: boolean
    aiEnabled?: boolean
    welcomeChannel?: boolean
    announcementChannel?: boolean
    updatesChannel?: boolean
    logsChannel?: boolean
    logLevel?: boolean
    premiumUser?: boolean | Servers$premiumUserArgs<ExtArgs>
  }, ExtArgs["result"]["servers"]>

  export type ServersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ownerId?: boolean
    isPremium?: boolean
    premiumAddedBy?: boolean
    aiEnabled?: boolean
    welcomeChannel?: boolean
    announcementChannel?: boolean
    updatesChannel?: boolean
    logsChannel?: boolean
    logLevel?: boolean
    premiumUser?: boolean | Servers$premiumUserArgs<ExtArgs>
  }, ExtArgs["result"]["servers"]>

  export type ServersSelectScalar = {
    id?: boolean
    name?: boolean
    ownerId?: boolean
    isPremium?: boolean
    premiumAddedBy?: boolean
    aiEnabled?: boolean
    welcomeChannel?: boolean
    announcementChannel?: boolean
    updatesChannel?: boolean
    logsChannel?: boolean
    logLevel?: boolean
  }

  export type ServersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "ownerId" | "isPremium" | "premiumAddedBy" | "aiEnabled" | "welcomeChannel" | "announcementChannel" | "updatesChannel" | "logsChannel" | "logLevel", ExtArgs["result"]["servers"]>
  export type ServersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    premiumUser?: boolean | Servers$premiumUserArgs<ExtArgs>
  }
  export type ServersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    premiumUser?: boolean | Servers$premiumUserArgs<ExtArgs>
  }
  export type ServersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    premiumUser?: boolean | Servers$premiumUserArgs<ExtArgs>
  }

  export type $ServersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Servers"
    objects: {
      premiumUser: Prisma.$UsersPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      ownerId: string
      isPremium: boolean
      premiumAddedBy: string | null
      aiEnabled: boolean
      welcomeChannel: string | null
      announcementChannel: string | null
      updatesChannel: string
      logsChannel: string | null
      logLevel: $Enums.LogLevel
    }, ExtArgs["result"]["servers"]>
    composites: {}
  }

  type ServersGetPayload<S extends boolean | null | undefined | ServersDefaultArgs> = $Result.GetResult<Prisma.$ServersPayload, S>

  type ServersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ServersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ServersCountAggregateInputType | true
    }

  export interface ServersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Servers'], meta: { name: 'Servers' } }
    /**
     * Find zero or one Servers that matches the filter.
     * @param {ServersFindUniqueArgs} args - Arguments to find a Servers
     * @example
     * // Get one Servers
     * const servers = await prisma.servers.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ServersFindUniqueArgs>(args: SelectSubset<T, ServersFindUniqueArgs<ExtArgs>>): Prisma__ServersClient<$Result.GetResult<Prisma.$ServersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Servers that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ServersFindUniqueOrThrowArgs} args - Arguments to find a Servers
     * @example
     * // Get one Servers
     * const servers = await prisma.servers.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ServersFindUniqueOrThrowArgs>(args: SelectSubset<T, ServersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ServersClient<$Result.GetResult<Prisma.$ServersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Servers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServersFindFirstArgs} args - Arguments to find a Servers
     * @example
     * // Get one Servers
     * const servers = await prisma.servers.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ServersFindFirstArgs>(args?: SelectSubset<T, ServersFindFirstArgs<ExtArgs>>): Prisma__ServersClient<$Result.GetResult<Prisma.$ServersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Servers that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServersFindFirstOrThrowArgs} args - Arguments to find a Servers
     * @example
     * // Get one Servers
     * const servers = await prisma.servers.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ServersFindFirstOrThrowArgs>(args?: SelectSubset<T, ServersFindFirstOrThrowArgs<ExtArgs>>): Prisma__ServersClient<$Result.GetResult<Prisma.$ServersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Servers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Servers
     * const servers = await prisma.servers.findMany()
     * 
     * // Get first 10 Servers
     * const servers = await prisma.servers.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const serversWithIdOnly = await prisma.servers.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ServersFindManyArgs>(args?: SelectSubset<T, ServersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Servers.
     * @param {ServersCreateArgs} args - Arguments to create a Servers.
     * @example
     * // Create one Servers
     * const Servers = await prisma.servers.create({
     *   data: {
     *     // ... data to create a Servers
     *   }
     * })
     * 
     */
    create<T extends ServersCreateArgs>(args: SelectSubset<T, ServersCreateArgs<ExtArgs>>): Prisma__ServersClient<$Result.GetResult<Prisma.$ServersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Servers.
     * @param {ServersCreateManyArgs} args - Arguments to create many Servers.
     * @example
     * // Create many Servers
     * const servers = await prisma.servers.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ServersCreateManyArgs>(args?: SelectSubset<T, ServersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Servers and returns the data saved in the database.
     * @param {ServersCreateManyAndReturnArgs} args - Arguments to create many Servers.
     * @example
     * // Create many Servers
     * const servers = await prisma.servers.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Servers and only return the `id`
     * const serversWithIdOnly = await prisma.servers.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ServersCreateManyAndReturnArgs>(args?: SelectSubset<T, ServersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Servers.
     * @param {ServersDeleteArgs} args - Arguments to delete one Servers.
     * @example
     * // Delete one Servers
     * const Servers = await prisma.servers.delete({
     *   where: {
     *     // ... filter to delete one Servers
     *   }
     * })
     * 
     */
    delete<T extends ServersDeleteArgs>(args: SelectSubset<T, ServersDeleteArgs<ExtArgs>>): Prisma__ServersClient<$Result.GetResult<Prisma.$ServersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Servers.
     * @param {ServersUpdateArgs} args - Arguments to update one Servers.
     * @example
     * // Update one Servers
     * const servers = await prisma.servers.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ServersUpdateArgs>(args: SelectSubset<T, ServersUpdateArgs<ExtArgs>>): Prisma__ServersClient<$Result.GetResult<Prisma.$ServersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Servers.
     * @param {ServersDeleteManyArgs} args - Arguments to filter Servers to delete.
     * @example
     * // Delete a few Servers
     * const { count } = await prisma.servers.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ServersDeleteManyArgs>(args?: SelectSubset<T, ServersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Servers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Servers
     * const servers = await prisma.servers.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ServersUpdateManyArgs>(args: SelectSubset<T, ServersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Servers and returns the data updated in the database.
     * @param {ServersUpdateManyAndReturnArgs} args - Arguments to update many Servers.
     * @example
     * // Update many Servers
     * const servers = await prisma.servers.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Servers and only return the `id`
     * const serversWithIdOnly = await prisma.servers.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ServersUpdateManyAndReturnArgs>(args: SelectSubset<T, ServersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Servers.
     * @param {ServersUpsertArgs} args - Arguments to update or create a Servers.
     * @example
     * // Update or create a Servers
     * const servers = await prisma.servers.upsert({
     *   create: {
     *     // ... data to create a Servers
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Servers we want to update
     *   }
     * })
     */
    upsert<T extends ServersUpsertArgs>(args: SelectSubset<T, ServersUpsertArgs<ExtArgs>>): Prisma__ServersClient<$Result.GetResult<Prisma.$ServersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Servers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServersCountArgs} args - Arguments to filter Servers to count.
     * @example
     * // Count the number of Servers
     * const count = await prisma.servers.count({
     *   where: {
     *     // ... the filter for the Servers we want to count
     *   }
     * })
    **/
    count<T extends ServersCountArgs>(
      args?: Subset<T, ServersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Servers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ServersAggregateArgs>(args: Subset<T, ServersAggregateArgs>): Prisma.PrismaPromise<GetServersAggregateType<T>>

    /**
     * Group by Servers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ServersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServersGroupByArgs['orderBy'] }
        : { orderBy?: ServersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ServersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Servers model
   */
  readonly fields: ServersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Servers.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ServersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    premiumUser<T extends Servers$premiumUserArgs<ExtArgs> = {}>(args?: Subset<T, Servers$premiumUserArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Servers model
   */
  interface ServersFieldRefs {
    readonly id: FieldRef<"Servers", 'String'>
    readonly name: FieldRef<"Servers", 'String'>
    readonly ownerId: FieldRef<"Servers", 'String'>
    readonly isPremium: FieldRef<"Servers", 'Boolean'>
    readonly premiumAddedBy: FieldRef<"Servers", 'String'>
    readonly aiEnabled: FieldRef<"Servers", 'Boolean'>
    readonly welcomeChannel: FieldRef<"Servers", 'String'>
    readonly announcementChannel: FieldRef<"Servers", 'String'>
    readonly updatesChannel: FieldRef<"Servers", 'String'>
    readonly logsChannel: FieldRef<"Servers", 'String'>
    readonly logLevel: FieldRef<"Servers", 'LogLevel'>
  }
    

  // Custom InputTypes
  /**
   * Servers findUnique
   */
  export type ServersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servers
     */
    select?: ServersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servers
     */
    omit?: ServersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServersInclude<ExtArgs> | null
    /**
     * Filter, which Servers to fetch.
     */
    where: ServersWhereUniqueInput
  }

  /**
   * Servers findUniqueOrThrow
   */
  export type ServersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servers
     */
    select?: ServersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servers
     */
    omit?: ServersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServersInclude<ExtArgs> | null
    /**
     * Filter, which Servers to fetch.
     */
    where: ServersWhereUniqueInput
  }

  /**
   * Servers findFirst
   */
  export type ServersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servers
     */
    select?: ServersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servers
     */
    omit?: ServersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServersInclude<ExtArgs> | null
    /**
     * Filter, which Servers to fetch.
     */
    where?: ServersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servers to fetch.
     */
    orderBy?: ServersOrderByWithRelationInput | ServersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Servers.
     */
    cursor?: ServersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Servers.
     */
    distinct?: ServersScalarFieldEnum | ServersScalarFieldEnum[]
  }

  /**
   * Servers findFirstOrThrow
   */
  export type ServersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servers
     */
    select?: ServersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servers
     */
    omit?: ServersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServersInclude<ExtArgs> | null
    /**
     * Filter, which Servers to fetch.
     */
    where?: ServersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servers to fetch.
     */
    orderBy?: ServersOrderByWithRelationInput | ServersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Servers.
     */
    cursor?: ServersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Servers.
     */
    distinct?: ServersScalarFieldEnum | ServersScalarFieldEnum[]
  }

  /**
   * Servers findMany
   */
  export type ServersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servers
     */
    select?: ServersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servers
     */
    omit?: ServersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServersInclude<ExtArgs> | null
    /**
     * Filter, which Servers to fetch.
     */
    where?: ServersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servers to fetch.
     */
    orderBy?: ServersOrderByWithRelationInput | ServersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Servers.
     */
    cursor?: ServersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servers.
     */
    skip?: number
    distinct?: ServersScalarFieldEnum | ServersScalarFieldEnum[]
  }

  /**
   * Servers create
   */
  export type ServersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servers
     */
    select?: ServersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servers
     */
    omit?: ServersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServersInclude<ExtArgs> | null
    /**
     * The data needed to create a Servers.
     */
    data: XOR<ServersCreateInput, ServersUncheckedCreateInput>
  }

  /**
   * Servers createMany
   */
  export type ServersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Servers.
     */
    data: ServersCreateManyInput | ServersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Servers createManyAndReturn
   */
  export type ServersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servers
     */
    select?: ServersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Servers
     */
    omit?: ServersOmit<ExtArgs> | null
    /**
     * The data used to create many Servers.
     */
    data: ServersCreateManyInput | ServersCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServersIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Servers update
   */
  export type ServersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servers
     */
    select?: ServersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servers
     */
    omit?: ServersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServersInclude<ExtArgs> | null
    /**
     * The data needed to update a Servers.
     */
    data: XOR<ServersUpdateInput, ServersUncheckedUpdateInput>
    /**
     * Choose, which Servers to update.
     */
    where: ServersWhereUniqueInput
  }

  /**
   * Servers updateMany
   */
  export type ServersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Servers.
     */
    data: XOR<ServersUpdateManyMutationInput, ServersUncheckedUpdateManyInput>
    /**
     * Filter which Servers to update
     */
    where?: ServersWhereInput
    /**
     * Limit how many Servers to update.
     */
    limit?: number
  }

  /**
   * Servers updateManyAndReturn
   */
  export type ServersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servers
     */
    select?: ServersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Servers
     */
    omit?: ServersOmit<ExtArgs> | null
    /**
     * The data used to update Servers.
     */
    data: XOR<ServersUpdateManyMutationInput, ServersUncheckedUpdateManyInput>
    /**
     * Filter which Servers to update
     */
    where?: ServersWhereInput
    /**
     * Limit how many Servers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServersIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Servers upsert
   */
  export type ServersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servers
     */
    select?: ServersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servers
     */
    omit?: ServersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServersInclude<ExtArgs> | null
    /**
     * The filter to search for the Servers to update in case it exists.
     */
    where: ServersWhereUniqueInput
    /**
     * In case the Servers found by the `where` argument doesn't exist, create a new Servers with this data.
     */
    create: XOR<ServersCreateInput, ServersUncheckedCreateInput>
    /**
     * In case the Servers was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServersUpdateInput, ServersUncheckedUpdateInput>
  }

  /**
   * Servers delete
   */
  export type ServersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servers
     */
    select?: ServersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servers
     */
    omit?: ServersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServersInclude<ExtArgs> | null
    /**
     * Filter which Servers to delete.
     */
    where: ServersWhereUniqueInput
  }

  /**
   * Servers deleteMany
   */
  export type ServersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Servers to delete
     */
    where?: ServersWhereInput
    /**
     * Limit how many Servers to delete.
     */
    limit?: number
  }

  /**
   * Servers.premiumUser
   */
  export type Servers$premiumUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    where?: UsersWhereInput
  }

  /**
   * Servers without action
   */
  export type ServersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servers
     */
    select?: ServersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servers
     */
    omit?: ServersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServersInclude<ExtArgs> | null
  }


  /**
   * Model PremiumSubscriptions
   */

  export type AggregatePremiumSubscriptions = {
    _count: PremiumSubscriptionsCountAggregateOutputType | null
    _min: PremiumSubscriptionsMinAggregateOutputType | null
    _max: PremiumSubscriptionsMaxAggregateOutputType | null
  }

  export type PremiumSubscriptionsMinAggregateOutputType = {
    id: string | null
    tier: $Enums.Plans | null
    startDate: Date | null
    endDate: Date | null
    source: $Enums.Sources | null
  }

  export type PremiumSubscriptionsMaxAggregateOutputType = {
    id: string | null
    tier: $Enums.Plans | null
    startDate: Date | null
    endDate: Date | null
    source: $Enums.Sources | null
  }

  export type PremiumSubscriptionsCountAggregateOutputType = {
    id: number
    tier: number
    startDate: number
    endDate: number
    source: number
    _all: number
  }


  export type PremiumSubscriptionsMinAggregateInputType = {
    id?: true
    tier?: true
    startDate?: true
    endDate?: true
    source?: true
  }

  export type PremiumSubscriptionsMaxAggregateInputType = {
    id?: true
    tier?: true
    startDate?: true
    endDate?: true
    source?: true
  }

  export type PremiumSubscriptionsCountAggregateInputType = {
    id?: true
    tier?: true
    startDate?: true
    endDate?: true
    source?: true
    _all?: true
  }

  export type PremiumSubscriptionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PremiumSubscriptions to aggregate.
     */
    where?: PremiumSubscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PremiumSubscriptions to fetch.
     */
    orderBy?: PremiumSubscriptionsOrderByWithRelationInput | PremiumSubscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PremiumSubscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PremiumSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PremiumSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PremiumSubscriptions
    **/
    _count?: true | PremiumSubscriptionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PremiumSubscriptionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PremiumSubscriptionsMaxAggregateInputType
  }

  export type GetPremiumSubscriptionsAggregateType<T extends PremiumSubscriptionsAggregateArgs> = {
        [P in keyof T & keyof AggregatePremiumSubscriptions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePremiumSubscriptions[P]>
      : GetScalarType<T[P], AggregatePremiumSubscriptions[P]>
  }




  export type PremiumSubscriptionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PremiumSubscriptionsWhereInput
    orderBy?: PremiumSubscriptionsOrderByWithAggregationInput | PremiumSubscriptionsOrderByWithAggregationInput[]
    by: PremiumSubscriptionsScalarFieldEnum[] | PremiumSubscriptionsScalarFieldEnum
    having?: PremiumSubscriptionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PremiumSubscriptionsCountAggregateInputType | true
    _min?: PremiumSubscriptionsMinAggregateInputType
    _max?: PremiumSubscriptionsMaxAggregateInputType
  }

  export type PremiumSubscriptionsGroupByOutputType = {
    id: string
    tier: $Enums.Plans
    startDate: Date
    endDate: Date
    source: $Enums.Sources
    _count: PremiumSubscriptionsCountAggregateOutputType | null
    _min: PremiumSubscriptionsMinAggregateOutputType | null
    _max: PremiumSubscriptionsMaxAggregateOutputType | null
  }

  type GetPremiumSubscriptionsGroupByPayload<T extends PremiumSubscriptionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PremiumSubscriptionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PremiumSubscriptionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PremiumSubscriptionsGroupByOutputType[P]>
            : GetScalarType<T[P], PremiumSubscriptionsGroupByOutputType[P]>
        }
      >
    >


  export type PremiumSubscriptionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tier?: boolean
    startDate?: boolean
    endDate?: boolean
    source?: boolean
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["premiumSubscriptions"]>

  export type PremiumSubscriptionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tier?: boolean
    startDate?: boolean
    endDate?: boolean
    source?: boolean
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["premiumSubscriptions"]>

  export type PremiumSubscriptionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tier?: boolean
    startDate?: boolean
    endDate?: boolean
    source?: boolean
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["premiumSubscriptions"]>

  export type PremiumSubscriptionsSelectScalar = {
    id?: boolean
    tier?: boolean
    startDate?: boolean
    endDate?: boolean
    source?: boolean
  }

  export type PremiumSubscriptionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tier" | "startDate" | "endDate" | "source", ExtArgs["result"]["premiumSubscriptions"]>
  export type PremiumSubscriptionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }
  export type PremiumSubscriptionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }
  export type PremiumSubscriptionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UsersDefaultArgs<ExtArgs>
  }

  export type $PremiumSubscriptionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PremiumSubscriptions"
    objects: {
      user: Prisma.$UsersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tier: $Enums.Plans
      startDate: Date
      endDate: Date
      source: $Enums.Sources
    }, ExtArgs["result"]["premiumSubscriptions"]>
    composites: {}
  }

  type PremiumSubscriptionsGetPayload<S extends boolean | null | undefined | PremiumSubscriptionsDefaultArgs> = $Result.GetResult<Prisma.$PremiumSubscriptionsPayload, S>

  type PremiumSubscriptionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PremiumSubscriptionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PremiumSubscriptionsCountAggregateInputType | true
    }

  export interface PremiumSubscriptionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PremiumSubscriptions'], meta: { name: 'PremiumSubscriptions' } }
    /**
     * Find zero or one PremiumSubscriptions that matches the filter.
     * @param {PremiumSubscriptionsFindUniqueArgs} args - Arguments to find a PremiumSubscriptions
     * @example
     * // Get one PremiumSubscriptions
     * const premiumSubscriptions = await prisma.premiumSubscriptions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PremiumSubscriptionsFindUniqueArgs>(args: SelectSubset<T, PremiumSubscriptionsFindUniqueArgs<ExtArgs>>): Prisma__PremiumSubscriptionsClient<$Result.GetResult<Prisma.$PremiumSubscriptionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PremiumSubscriptions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PremiumSubscriptionsFindUniqueOrThrowArgs} args - Arguments to find a PremiumSubscriptions
     * @example
     * // Get one PremiumSubscriptions
     * const premiumSubscriptions = await prisma.premiumSubscriptions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PremiumSubscriptionsFindUniqueOrThrowArgs>(args: SelectSubset<T, PremiumSubscriptionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PremiumSubscriptionsClient<$Result.GetResult<Prisma.$PremiumSubscriptionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PremiumSubscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PremiumSubscriptionsFindFirstArgs} args - Arguments to find a PremiumSubscriptions
     * @example
     * // Get one PremiumSubscriptions
     * const premiumSubscriptions = await prisma.premiumSubscriptions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PremiumSubscriptionsFindFirstArgs>(args?: SelectSubset<T, PremiumSubscriptionsFindFirstArgs<ExtArgs>>): Prisma__PremiumSubscriptionsClient<$Result.GetResult<Prisma.$PremiumSubscriptionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PremiumSubscriptions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PremiumSubscriptionsFindFirstOrThrowArgs} args - Arguments to find a PremiumSubscriptions
     * @example
     * // Get one PremiumSubscriptions
     * const premiumSubscriptions = await prisma.premiumSubscriptions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PremiumSubscriptionsFindFirstOrThrowArgs>(args?: SelectSubset<T, PremiumSubscriptionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__PremiumSubscriptionsClient<$Result.GetResult<Prisma.$PremiumSubscriptionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PremiumSubscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PremiumSubscriptionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PremiumSubscriptions
     * const premiumSubscriptions = await prisma.premiumSubscriptions.findMany()
     * 
     * // Get first 10 PremiumSubscriptions
     * const premiumSubscriptions = await prisma.premiumSubscriptions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const premiumSubscriptionsWithIdOnly = await prisma.premiumSubscriptions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PremiumSubscriptionsFindManyArgs>(args?: SelectSubset<T, PremiumSubscriptionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PremiumSubscriptionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PremiumSubscriptions.
     * @param {PremiumSubscriptionsCreateArgs} args - Arguments to create a PremiumSubscriptions.
     * @example
     * // Create one PremiumSubscriptions
     * const PremiumSubscriptions = await prisma.premiumSubscriptions.create({
     *   data: {
     *     // ... data to create a PremiumSubscriptions
     *   }
     * })
     * 
     */
    create<T extends PremiumSubscriptionsCreateArgs>(args: SelectSubset<T, PremiumSubscriptionsCreateArgs<ExtArgs>>): Prisma__PremiumSubscriptionsClient<$Result.GetResult<Prisma.$PremiumSubscriptionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PremiumSubscriptions.
     * @param {PremiumSubscriptionsCreateManyArgs} args - Arguments to create many PremiumSubscriptions.
     * @example
     * // Create many PremiumSubscriptions
     * const premiumSubscriptions = await prisma.premiumSubscriptions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PremiumSubscriptionsCreateManyArgs>(args?: SelectSubset<T, PremiumSubscriptionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PremiumSubscriptions and returns the data saved in the database.
     * @param {PremiumSubscriptionsCreateManyAndReturnArgs} args - Arguments to create many PremiumSubscriptions.
     * @example
     * // Create many PremiumSubscriptions
     * const premiumSubscriptions = await prisma.premiumSubscriptions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PremiumSubscriptions and only return the `id`
     * const premiumSubscriptionsWithIdOnly = await prisma.premiumSubscriptions.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PremiumSubscriptionsCreateManyAndReturnArgs>(args?: SelectSubset<T, PremiumSubscriptionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PremiumSubscriptionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PremiumSubscriptions.
     * @param {PremiumSubscriptionsDeleteArgs} args - Arguments to delete one PremiumSubscriptions.
     * @example
     * // Delete one PremiumSubscriptions
     * const PremiumSubscriptions = await prisma.premiumSubscriptions.delete({
     *   where: {
     *     // ... filter to delete one PremiumSubscriptions
     *   }
     * })
     * 
     */
    delete<T extends PremiumSubscriptionsDeleteArgs>(args: SelectSubset<T, PremiumSubscriptionsDeleteArgs<ExtArgs>>): Prisma__PremiumSubscriptionsClient<$Result.GetResult<Prisma.$PremiumSubscriptionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PremiumSubscriptions.
     * @param {PremiumSubscriptionsUpdateArgs} args - Arguments to update one PremiumSubscriptions.
     * @example
     * // Update one PremiumSubscriptions
     * const premiumSubscriptions = await prisma.premiumSubscriptions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PremiumSubscriptionsUpdateArgs>(args: SelectSubset<T, PremiumSubscriptionsUpdateArgs<ExtArgs>>): Prisma__PremiumSubscriptionsClient<$Result.GetResult<Prisma.$PremiumSubscriptionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PremiumSubscriptions.
     * @param {PremiumSubscriptionsDeleteManyArgs} args - Arguments to filter PremiumSubscriptions to delete.
     * @example
     * // Delete a few PremiumSubscriptions
     * const { count } = await prisma.premiumSubscriptions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PremiumSubscriptionsDeleteManyArgs>(args?: SelectSubset<T, PremiumSubscriptionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PremiumSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PremiumSubscriptionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PremiumSubscriptions
     * const premiumSubscriptions = await prisma.premiumSubscriptions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PremiumSubscriptionsUpdateManyArgs>(args: SelectSubset<T, PremiumSubscriptionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PremiumSubscriptions and returns the data updated in the database.
     * @param {PremiumSubscriptionsUpdateManyAndReturnArgs} args - Arguments to update many PremiumSubscriptions.
     * @example
     * // Update many PremiumSubscriptions
     * const premiumSubscriptions = await prisma.premiumSubscriptions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PremiumSubscriptions and only return the `id`
     * const premiumSubscriptionsWithIdOnly = await prisma.premiumSubscriptions.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PremiumSubscriptionsUpdateManyAndReturnArgs>(args: SelectSubset<T, PremiumSubscriptionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PremiumSubscriptionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PremiumSubscriptions.
     * @param {PremiumSubscriptionsUpsertArgs} args - Arguments to update or create a PremiumSubscriptions.
     * @example
     * // Update or create a PremiumSubscriptions
     * const premiumSubscriptions = await prisma.premiumSubscriptions.upsert({
     *   create: {
     *     // ... data to create a PremiumSubscriptions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PremiumSubscriptions we want to update
     *   }
     * })
     */
    upsert<T extends PremiumSubscriptionsUpsertArgs>(args: SelectSubset<T, PremiumSubscriptionsUpsertArgs<ExtArgs>>): Prisma__PremiumSubscriptionsClient<$Result.GetResult<Prisma.$PremiumSubscriptionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PremiumSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PremiumSubscriptionsCountArgs} args - Arguments to filter PremiumSubscriptions to count.
     * @example
     * // Count the number of PremiumSubscriptions
     * const count = await prisma.premiumSubscriptions.count({
     *   where: {
     *     // ... the filter for the PremiumSubscriptions we want to count
     *   }
     * })
    **/
    count<T extends PremiumSubscriptionsCountArgs>(
      args?: Subset<T, PremiumSubscriptionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PremiumSubscriptionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PremiumSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PremiumSubscriptionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PremiumSubscriptionsAggregateArgs>(args: Subset<T, PremiumSubscriptionsAggregateArgs>): Prisma.PrismaPromise<GetPremiumSubscriptionsAggregateType<T>>

    /**
     * Group by PremiumSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PremiumSubscriptionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PremiumSubscriptionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PremiumSubscriptionsGroupByArgs['orderBy'] }
        : { orderBy?: PremiumSubscriptionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PremiumSubscriptionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPremiumSubscriptionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PremiumSubscriptions model
   */
  readonly fields: PremiumSubscriptionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PremiumSubscriptions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PremiumSubscriptionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UsersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsersDefaultArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PremiumSubscriptions model
   */
  interface PremiumSubscriptionsFieldRefs {
    readonly id: FieldRef<"PremiumSubscriptions", 'String'>
    readonly tier: FieldRef<"PremiumSubscriptions", 'Plans'>
    readonly startDate: FieldRef<"PremiumSubscriptions", 'DateTime'>
    readonly endDate: FieldRef<"PremiumSubscriptions", 'DateTime'>
    readonly source: FieldRef<"PremiumSubscriptions", 'Sources'>
  }
    

  // Custom InputTypes
  /**
   * PremiumSubscriptions findUnique
   */
  export type PremiumSubscriptionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumSubscriptions
     */
    select?: PremiumSubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PremiumSubscriptions
     */
    omit?: PremiumSubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PremiumSubscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which PremiumSubscriptions to fetch.
     */
    where: PremiumSubscriptionsWhereUniqueInput
  }

  /**
   * PremiumSubscriptions findUniqueOrThrow
   */
  export type PremiumSubscriptionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumSubscriptions
     */
    select?: PremiumSubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PremiumSubscriptions
     */
    omit?: PremiumSubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PremiumSubscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which PremiumSubscriptions to fetch.
     */
    where: PremiumSubscriptionsWhereUniqueInput
  }

  /**
   * PremiumSubscriptions findFirst
   */
  export type PremiumSubscriptionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumSubscriptions
     */
    select?: PremiumSubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PremiumSubscriptions
     */
    omit?: PremiumSubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PremiumSubscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which PremiumSubscriptions to fetch.
     */
    where?: PremiumSubscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PremiumSubscriptions to fetch.
     */
    orderBy?: PremiumSubscriptionsOrderByWithRelationInput | PremiumSubscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PremiumSubscriptions.
     */
    cursor?: PremiumSubscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PremiumSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PremiumSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PremiumSubscriptions.
     */
    distinct?: PremiumSubscriptionsScalarFieldEnum | PremiumSubscriptionsScalarFieldEnum[]
  }

  /**
   * PremiumSubscriptions findFirstOrThrow
   */
  export type PremiumSubscriptionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumSubscriptions
     */
    select?: PremiumSubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PremiumSubscriptions
     */
    omit?: PremiumSubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PremiumSubscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which PremiumSubscriptions to fetch.
     */
    where?: PremiumSubscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PremiumSubscriptions to fetch.
     */
    orderBy?: PremiumSubscriptionsOrderByWithRelationInput | PremiumSubscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PremiumSubscriptions.
     */
    cursor?: PremiumSubscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PremiumSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PremiumSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PremiumSubscriptions.
     */
    distinct?: PremiumSubscriptionsScalarFieldEnum | PremiumSubscriptionsScalarFieldEnum[]
  }

  /**
   * PremiumSubscriptions findMany
   */
  export type PremiumSubscriptionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumSubscriptions
     */
    select?: PremiumSubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PremiumSubscriptions
     */
    omit?: PremiumSubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PremiumSubscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which PremiumSubscriptions to fetch.
     */
    where?: PremiumSubscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PremiumSubscriptions to fetch.
     */
    orderBy?: PremiumSubscriptionsOrderByWithRelationInput | PremiumSubscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PremiumSubscriptions.
     */
    cursor?: PremiumSubscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PremiumSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PremiumSubscriptions.
     */
    skip?: number
    distinct?: PremiumSubscriptionsScalarFieldEnum | PremiumSubscriptionsScalarFieldEnum[]
  }

  /**
   * PremiumSubscriptions create
   */
  export type PremiumSubscriptionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumSubscriptions
     */
    select?: PremiumSubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PremiumSubscriptions
     */
    omit?: PremiumSubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PremiumSubscriptionsInclude<ExtArgs> | null
    /**
     * The data needed to create a PremiumSubscriptions.
     */
    data: XOR<PremiumSubscriptionsCreateInput, PremiumSubscriptionsUncheckedCreateInput>
  }

  /**
   * PremiumSubscriptions createMany
   */
  export type PremiumSubscriptionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PremiumSubscriptions.
     */
    data: PremiumSubscriptionsCreateManyInput | PremiumSubscriptionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PremiumSubscriptions createManyAndReturn
   */
  export type PremiumSubscriptionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumSubscriptions
     */
    select?: PremiumSubscriptionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PremiumSubscriptions
     */
    omit?: PremiumSubscriptionsOmit<ExtArgs> | null
    /**
     * The data used to create many PremiumSubscriptions.
     */
    data: PremiumSubscriptionsCreateManyInput | PremiumSubscriptionsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PremiumSubscriptionsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PremiumSubscriptions update
   */
  export type PremiumSubscriptionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumSubscriptions
     */
    select?: PremiumSubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PremiumSubscriptions
     */
    omit?: PremiumSubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PremiumSubscriptionsInclude<ExtArgs> | null
    /**
     * The data needed to update a PremiumSubscriptions.
     */
    data: XOR<PremiumSubscriptionsUpdateInput, PremiumSubscriptionsUncheckedUpdateInput>
    /**
     * Choose, which PremiumSubscriptions to update.
     */
    where: PremiumSubscriptionsWhereUniqueInput
  }

  /**
   * PremiumSubscriptions updateMany
   */
  export type PremiumSubscriptionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PremiumSubscriptions.
     */
    data: XOR<PremiumSubscriptionsUpdateManyMutationInput, PremiumSubscriptionsUncheckedUpdateManyInput>
    /**
     * Filter which PremiumSubscriptions to update
     */
    where?: PremiumSubscriptionsWhereInput
    /**
     * Limit how many PremiumSubscriptions to update.
     */
    limit?: number
  }

  /**
   * PremiumSubscriptions updateManyAndReturn
   */
  export type PremiumSubscriptionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumSubscriptions
     */
    select?: PremiumSubscriptionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PremiumSubscriptions
     */
    omit?: PremiumSubscriptionsOmit<ExtArgs> | null
    /**
     * The data used to update PremiumSubscriptions.
     */
    data: XOR<PremiumSubscriptionsUpdateManyMutationInput, PremiumSubscriptionsUncheckedUpdateManyInput>
    /**
     * Filter which PremiumSubscriptions to update
     */
    where?: PremiumSubscriptionsWhereInput
    /**
     * Limit how many PremiumSubscriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PremiumSubscriptionsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PremiumSubscriptions upsert
   */
  export type PremiumSubscriptionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumSubscriptions
     */
    select?: PremiumSubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PremiumSubscriptions
     */
    omit?: PremiumSubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PremiumSubscriptionsInclude<ExtArgs> | null
    /**
     * The filter to search for the PremiumSubscriptions to update in case it exists.
     */
    where: PremiumSubscriptionsWhereUniqueInput
    /**
     * In case the PremiumSubscriptions found by the `where` argument doesn't exist, create a new PremiumSubscriptions with this data.
     */
    create: XOR<PremiumSubscriptionsCreateInput, PremiumSubscriptionsUncheckedCreateInput>
    /**
     * In case the PremiumSubscriptions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PremiumSubscriptionsUpdateInput, PremiumSubscriptionsUncheckedUpdateInput>
  }

  /**
   * PremiumSubscriptions delete
   */
  export type PremiumSubscriptionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumSubscriptions
     */
    select?: PremiumSubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PremiumSubscriptions
     */
    omit?: PremiumSubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PremiumSubscriptionsInclude<ExtArgs> | null
    /**
     * Filter which PremiumSubscriptions to delete.
     */
    where: PremiumSubscriptionsWhereUniqueInput
  }

  /**
   * PremiumSubscriptions deleteMany
   */
  export type PremiumSubscriptionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PremiumSubscriptions to delete
     */
    where?: PremiumSubscriptionsWhereInput
    /**
     * Limit how many PremiumSubscriptions to delete.
     */
    limit?: number
  }

  /**
   * PremiumSubscriptions without action
   */
  export type PremiumSubscriptionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumSubscriptions
     */
    select?: PremiumSubscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PremiumSubscriptions
     */
    omit?: PremiumSubscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PremiumSubscriptionsInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UsersScalarFieldEnum: {
    id: 'id',
    username: 'username',
    email: 'email',
    extId: 'extId',
    discordId: 'discordId',
    plan: 'plan'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const LimitsScalarFieldEnum: {
    id: 'id',
    date: 'date',
    aiUsed: 'aiUsed',
    aiLimit: 'aiLimit',
    additionalMessages: 'additionalMessages',
    premiumServers: 'premiumServers',
    premiumServerLimmit: 'premiumServerLimmit'
  };

  export type LimitsScalarFieldEnum = (typeof LimitsScalarFieldEnum)[keyof typeof LimitsScalarFieldEnum]


  export const ServersScalarFieldEnum: {
    id: 'id',
    name: 'name',
    ownerId: 'ownerId',
    isPremium: 'isPremium',
    premiumAddedBy: 'premiumAddedBy',
    aiEnabled: 'aiEnabled',
    welcomeChannel: 'welcomeChannel',
    announcementChannel: 'announcementChannel',
    updatesChannel: 'updatesChannel',
    logsChannel: 'logsChannel',
    logLevel: 'logLevel'
  };

  export type ServersScalarFieldEnum = (typeof ServersScalarFieldEnum)[keyof typeof ServersScalarFieldEnum]


  export const PremiumSubscriptionsScalarFieldEnum: {
    id: 'id',
    tier: 'tier',
    startDate: 'startDate',
    endDate: 'endDate',
    source: 'source'
  };

  export type PremiumSubscriptionsScalarFieldEnum = (typeof PremiumSubscriptionsScalarFieldEnum)[keyof typeof PremiumSubscriptionsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Plans'
   */
  export type EnumPlansFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Plans'>
    


  /**
   * Reference to a field of type 'Plans[]'
   */
  export type ListEnumPlansFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Plans[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'LogLevel'
   */
  export type EnumLogLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LogLevel'>
    


  /**
   * Reference to a field of type 'LogLevel[]'
   */
  export type ListEnumLogLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LogLevel[]'>
    


  /**
   * Reference to a field of type 'Sources'
   */
  export type EnumSourcesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Sources'>
    


  /**
   * Reference to a field of type 'Sources[]'
   */
  export type ListEnumSourcesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Sources[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UsersWhereInput = {
    AND?: UsersWhereInput | UsersWhereInput[]
    OR?: UsersWhereInput[]
    NOT?: UsersWhereInput | UsersWhereInput[]
    id?: StringFilter<"Users"> | string
    username?: StringFilter<"Users"> | string
    email?: StringNullableFilter<"Users"> | string | null
    extId?: StringNullableFilter<"Users"> | string | null
    discordId?: StringFilter<"Users"> | string
    plan?: EnumPlansFilter<"Users"> | $Enums.Plans
    premiumSubscriptions?: XOR<PremiumSubscriptionsNullableScalarRelationFilter, PremiumSubscriptionsWhereInput> | null
    limits?: XOR<LimitsNullableScalarRelationFilter, LimitsWhereInput> | null
    premiumServers?: ServersListRelationFilter
  }

  export type UsersOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrderInput | SortOrder
    extId?: SortOrderInput | SortOrder
    discordId?: SortOrder
    plan?: SortOrder
    premiumSubscriptions?: PremiumSubscriptionsOrderByWithRelationInput
    limits?: LimitsOrderByWithRelationInput
    premiumServers?: ServersOrderByRelationAggregateInput
  }

  export type UsersWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    extId?: string
    discordId?: string
    AND?: UsersWhereInput | UsersWhereInput[]
    OR?: UsersWhereInput[]
    NOT?: UsersWhereInput | UsersWhereInput[]
    plan?: EnumPlansFilter<"Users"> | $Enums.Plans
    premiumSubscriptions?: XOR<PremiumSubscriptionsNullableScalarRelationFilter, PremiumSubscriptionsWhereInput> | null
    limits?: XOR<LimitsNullableScalarRelationFilter, LimitsWhereInput> | null
    premiumServers?: ServersListRelationFilter
  }, "id" | "username" | "email" | "extId" | "discordId">

  export type UsersOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrderInput | SortOrder
    extId?: SortOrderInput | SortOrder
    discordId?: SortOrder
    plan?: SortOrder
    _count?: UsersCountOrderByAggregateInput
    _max?: UsersMaxOrderByAggregateInput
    _min?: UsersMinOrderByAggregateInput
  }

  export type UsersScalarWhereWithAggregatesInput = {
    AND?: UsersScalarWhereWithAggregatesInput | UsersScalarWhereWithAggregatesInput[]
    OR?: UsersScalarWhereWithAggregatesInput[]
    NOT?: UsersScalarWhereWithAggregatesInput | UsersScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Users"> | string
    username?: StringWithAggregatesFilter<"Users"> | string
    email?: StringNullableWithAggregatesFilter<"Users"> | string | null
    extId?: StringNullableWithAggregatesFilter<"Users"> | string | null
    discordId?: StringWithAggregatesFilter<"Users"> | string
    plan?: EnumPlansWithAggregatesFilter<"Users"> | $Enums.Plans
  }

  export type LimitsWhereInput = {
    AND?: LimitsWhereInput | LimitsWhereInput[]
    OR?: LimitsWhereInput[]
    NOT?: LimitsWhereInput | LimitsWhereInput[]
    id?: StringFilter<"Limits"> | string
    date?: DateTimeFilter<"Limits"> | Date | string
    aiUsed?: IntFilter<"Limits"> | number
    aiLimit?: IntFilter<"Limits"> | number
    additionalMessages?: IntFilter<"Limits"> | number
    premiumServers?: IntFilter<"Limits"> | number
    premiumServerLimmit?: IntFilter<"Limits"> | number
    user?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }

  export type LimitsOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    aiUsed?: SortOrder
    aiLimit?: SortOrder
    additionalMessages?: SortOrder
    premiumServers?: SortOrder
    premiumServerLimmit?: SortOrder
    user?: UsersOrderByWithRelationInput
  }

  export type LimitsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LimitsWhereInput | LimitsWhereInput[]
    OR?: LimitsWhereInput[]
    NOT?: LimitsWhereInput | LimitsWhereInput[]
    date?: DateTimeFilter<"Limits"> | Date | string
    aiUsed?: IntFilter<"Limits"> | number
    aiLimit?: IntFilter<"Limits"> | number
    additionalMessages?: IntFilter<"Limits"> | number
    premiumServers?: IntFilter<"Limits"> | number
    premiumServerLimmit?: IntFilter<"Limits"> | number
    user?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }, "id">

  export type LimitsOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    aiUsed?: SortOrder
    aiLimit?: SortOrder
    additionalMessages?: SortOrder
    premiumServers?: SortOrder
    premiumServerLimmit?: SortOrder
    _count?: LimitsCountOrderByAggregateInput
    _avg?: LimitsAvgOrderByAggregateInput
    _max?: LimitsMaxOrderByAggregateInput
    _min?: LimitsMinOrderByAggregateInput
    _sum?: LimitsSumOrderByAggregateInput
  }

  export type LimitsScalarWhereWithAggregatesInput = {
    AND?: LimitsScalarWhereWithAggregatesInput | LimitsScalarWhereWithAggregatesInput[]
    OR?: LimitsScalarWhereWithAggregatesInput[]
    NOT?: LimitsScalarWhereWithAggregatesInput | LimitsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Limits"> | string
    date?: DateTimeWithAggregatesFilter<"Limits"> | Date | string
    aiUsed?: IntWithAggregatesFilter<"Limits"> | number
    aiLimit?: IntWithAggregatesFilter<"Limits"> | number
    additionalMessages?: IntWithAggregatesFilter<"Limits"> | number
    premiumServers?: IntWithAggregatesFilter<"Limits"> | number
    premiumServerLimmit?: IntWithAggregatesFilter<"Limits"> | number
  }

  export type ServersWhereInput = {
    AND?: ServersWhereInput | ServersWhereInput[]
    OR?: ServersWhereInput[]
    NOT?: ServersWhereInput | ServersWhereInput[]
    id?: StringFilter<"Servers"> | string
    name?: StringFilter<"Servers"> | string
    ownerId?: StringFilter<"Servers"> | string
    isPremium?: BoolFilter<"Servers"> | boolean
    premiumAddedBy?: StringNullableFilter<"Servers"> | string | null
    aiEnabled?: BoolFilter<"Servers"> | boolean
    welcomeChannel?: StringNullableFilter<"Servers"> | string | null
    announcementChannel?: StringNullableFilter<"Servers"> | string | null
    updatesChannel?: StringFilter<"Servers"> | string
    logsChannel?: StringNullableFilter<"Servers"> | string | null
    logLevel?: EnumLogLevelFilter<"Servers"> | $Enums.LogLevel
    premiumUser?: XOR<UsersNullableScalarRelationFilter, UsersWhereInput> | null
  }

  export type ServersOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    isPremium?: SortOrder
    premiumAddedBy?: SortOrderInput | SortOrder
    aiEnabled?: SortOrder
    welcomeChannel?: SortOrderInput | SortOrder
    announcementChannel?: SortOrderInput | SortOrder
    updatesChannel?: SortOrder
    logsChannel?: SortOrderInput | SortOrder
    logLevel?: SortOrder
    premiumUser?: UsersOrderByWithRelationInput
  }

  export type ServersWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ServersWhereInput | ServersWhereInput[]
    OR?: ServersWhereInput[]
    NOT?: ServersWhereInput | ServersWhereInput[]
    name?: StringFilter<"Servers"> | string
    ownerId?: StringFilter<"Servers"> | string
    isPremium?: BoolFilter<"Servers"> | boolean
    premiumAddedBy?: StringNullableFilter<"Servers"> | string | null
    aiEnabled?: BoolFilter<"Servers"> | boolean
    welcomeChannel?: StringNullableFilter<"Servers"> | string | null
    announcementChannel?: StringNullableFilter<"Servers"> | string | null
    updatesChannel?: StringFilter<"Servers"> | string
    logsChannel?: StringNullableFilter<"Servers"> | string | null
    logLevel?: EnumLogLevelFilter<"Servers"> | $Enums.LogLevel
    premiumUser?: XOR<UsersNullableScalarRelationFilter, UsersWhereInput> | null
  }, "id">

  export type ServersOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    isPremium?: SortOrder
    premiumAddedBy?: SortOrderInput | SortOrder
    aiEnabled?: SortOrder
    welcomeChannel?: SortOrderInput | SortOrder
    announcementChannel?: SortOrderInput | SortOrder
    updatesChannel?: SortOrder
    logsChannel?: SortOrderInput | SortOrder
    logLevel?: SortOrder
    _count?: ServersCountOrderByAggregateInput
    _max?: ServersMaxOrderByAggregateInput
    _min?: ServersMinOrderByAggregateInput
  }

  export type ServersScalarWhereWithAggregatesInput = {
    AND?: ServersScalarWhereWithAggregatesInput | ServersScalarWhereWithAggregatesInput[]
    OR?: ServersScalarWhereWithAggregatesInput[]
    NOT?: ServersScalarWhereWithAggregatesInput | ServersScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Servers"> | string
    name?: StringWithAggregatesFilter<"Servers"> | string
    ownerId?: StringWithAggregatesFilter<"Servers"> | string
    isPremium?: BoolWithAggregatesFilter<"Servers"> | boolean
    premiumAddedBy?: StringNullableWithAggregatesFilter<"Servers"> | string | null
    aiEnabled?: BoolWithAggregatesFilter<"Servers"> | boolean
    welcomeChannel?: StringNullableWithAggregatesFilter<"Servers"> | string | null
    announcementChannel?: StringNullableWithAggregatesFilter<"Servers"> | string | null
    updatesChannel?: StringWithAggregatesFilter<"Servers"> | string
    logsChannel?: StringNullableWithAggregatesFilter<"Servers"> | string | null
    logLevel?: EnumLogLevelWithAggregatesFilter<"Servers"> | $Enums.LogLevel
  }

  export type PremiumSubscriptionsWhereInput = {
    AND?: PremiumSubscriptionsWhereInput | PremiumSubscriptionsWhereInput[]
    OR?: PremiumSubscriptionsWhereInput[]
    NOT?: PremiumSubscriptionsWhereInput | PremiumSubscriptionsWhereInput[]
    id?: StringFilter<"PremiumSubscriptions"> | string
    tier?: EnumPlansFilter<"PremiumSubscriptions"> | $Enums.Plans
    startDate?: DateTimeFilter<"PremiumSubscriptions"> | Date | string
    endDate?: DateTimeFilter<"PremiumSubscriptions"> | Date | string
    source?: EnumSourcesFilter<"PremiumSubscriptions"> | $Enums.Sources
    user?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }

  export type PremiumSubscriptionsOrderByWithRelationInput = {
    id?: SortOrder
    tier?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    source?: SortOrder
    user?: UsersOrderByWithRelationInput
  }

  export type PremiumSubscriptionsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PremiumSubscriptionsWhereInput | PremiumSubscriptionsWhereInput[]
    OR?: PremiumSubscriptionsWhereInput[]
    NOT?: PremiumSubscriptionsWhereInput | PremiumSubscriptionsWhereInput[]
    tier?: EnumPlansFilter<"PremiumSubscriptions"> | $Enums.Plans
    startDate?: DateTimeFilter<"PremiumSubscriptions"> | Date | string
    endDate?: DateTimeFilter<"PremiumSubscriptions"> | Date | string
    source?: EnumSourcesFilter<"PremiumSubscriptions"> | $Enums.Sources
    user?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }, "id">

  export type PremiumSubscriptionsOrderByWithAggregationInput = {
    id?: SortOrder
    tier?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    source?: SortOrder
    _count?: PremiumSubscriptionsCountOrderByAggregateInput
    _max?: PremiumSubscriptionsMaxOrderByAggregateInput
    _min?: PremiumSubscriptionsMinOrderByAggregateInput
  }

  export type PremiumSubscriptionsScalarWhereWithAggregatesInput = {
    AND?: PremiumSubscriptionsScalarWhereWithAggregatesInput | PremiumSubscriptionsScalarWhereWithAggregatesInput[]
    OR?: PremiumSubscriptionsScalarWhereWithAggregatesInput[]
    NOT?: PremiumSubscriptionsScalarWhereWithAggregatesInput | PremiumSubscriptionsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PremiumSubscriptions"> | string
    tier?: EnumPlansWithAggregatesFilter<"PremiumSubscriptions"> | $Enums.Plans
    startDate?: DateTimeWithAggregatesFilter<"PremiumSubscriptions"> | Date | string
    endDate?: DateTimeWithAggregatesFilter<"PremiumSubscriptions"> | Date | string
    source?: EnumSourcesWithAggregatesFilter<"PremiumSubscriptions"> | $Enums.Sources
  }

  export type UsersCreateInput = {
    id?: string
    username: string
    email?: string | null
    extId?: string | null
    discordId: string
    plan?: $Enums.Plans
    premiumSubscriptions?: PremiumSubscriptionsCreateNestedOneWithoutUserInput
    limits?: LimitsCreateNestedOneWithoutUserInput
    premiumServers?: ServersCreateNestedManyWithoutPremiumUserInput
  }

  export type UsersUncheckedCreateInput = {
    id?: string
    username: string
    email?: string | null
    extId?: string | null
    discordId: string
    plan?: $Enums.Plans
    premiumSubscriptions?: PremiumSubscriptionsUncheckedCreateNestedOneWithoutUserInput
    limits?: LimitsUncheckedCreateNestedOneWithoutUserInput
    premiumServers?: ServersUncheckedCreateNestedManyWithoutPremiumUserInput
  }

  export type UsersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    extId?: NullableStringFieldUpdateOperationsInput | string | null
    discordId?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
    premiumSubscriptions?: PremiumSubscriptionsUpdateOneWithoutUserNestedInput
    limits?: LimitsUpdateOneWithoutUserNestedInput
    premiumServers?: ServersUpdateManyWithoutPremiumUserNestedInput
  }

  export type UsersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    extId?: NullableStringFieldUpdateOperationsInput | string | null
    discordId?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
    premiumSubscriptions?: PremiumSubscriptionsUncheckedUpdateOneWithoutUserNestedInput
    limits?: LimitsUncheckedUpdateOneWithoutUserNestedInput
    premiumServers?: ServersUncheckedUpdateManyWithoutPremiumUserNestedInput
  }

  export type UsersCreateManyInput = {
    id?: string
    username: string
    email?: string | null
    extId?: string | null
    discordId: string
    plan?: $Enums.Plans
  }

  export type UsersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    extId?: NullableStringFieldUpdateOperationsInput | string | null
    discordId?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
  }

  export type UsersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    extId?: NullableStringFieldUpdateOperationsInput | string | null
    discordId?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
  }

  export type LimitsCreateInput = {
    date: Date | string
    aiUsed?: number
    aiLimit?: number
    additionalMessages?: number
    premiumServers?: number
    premiumServerLimmit?: number
    user: UsersCreateNestedOneWithoutLimitsInput
  }

  export type LimitsUncheckedCreateInput = {
    id: string
    date: Date | string
    aiUsed?: number
    aiLimit?: number
    additionalMessages?: number
    premiumServers?: number
    premiumServerLimmit?: number
  }

  export type LimitsUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    aiUsed?: IntFieldUpdateOperationsInput | number
    aiLimit?: IntFieldUpdateOperationsInput | number
    additionalMessages?: IntFieldUpdateOperationsInput | number
    premiumServers?: IntFieldUpdateOperationsInput | number
    premiumServerLimmit?: IntFieldUpdateOperationsInput | number
    user?: UsersUpdateOneRequiredWithoutLimitsNestedInput
  }

  export type LimitsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    aiUsed?: IntFieldUpdateOperationsInput | number
    aiLimit?: IntFieldUpdateOperationsInput | number
    additionalMessages?: IntFieldUpdateOperationsInput | number
    premiumServers?: IntFieldUpdateOperationsInput | number
    premiumServerLimmit?: IntFieldUpdateOperationsInput | number
  }

  export type LimitsCreateManyInput = {
    id: string
    date: Date | string
    aiUsed?: number
    aiLimit?: number
    additionalMessages?: number
    premiumServers?: number
    premiumServerLimmit?: number
  }

  export type LimitsUpdateManyMutationInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    aiUsed?: IntFieldUpdateOperationsInput | number
    aiLimit?: IntFieldUpdateOperationsInput | number
    additionalMessages?: IntFieldUpdateOperationsInput | number
    premiumServers?: IntFieldUpdateOperationsInput | number
    premiumServerLimmit?: IntFieldUpdateOperationsInput | number
  }

  export type LimitsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    aiUsed?: IntFieldUpdateOperationsInput | number
    aiLimit?: IntFieldUpdateOperationsInput | number
    additionalMessages?: IntFieldUpdateOperationsInput | number
    premiumServers?: IntFieldUpdateOperationsInput | number
    premiumServerLimmit?: IntFieldUpdateOperationsInput | number
  }

  export type ServersCreateInput = {
    id: string
    name: string
    ownerId: string
    isPremium?: boolean
    aiEnabled?: boolean
    welcomeChannel?: string | null
    announcementChannel?: string | null
    updatesChannel: string
    logsChannel?: string | null
    logLevel?: $Enums.LogLevel
    premiumUser?: UsersCreateNestedOneWithoutPremiumServersInput
  }

  export type ServersUncheckedCreateInput = {
    id: string
    name: string
    ownerId: string
    isPremium?: boolean
    premiumAddedBy?: string | null
    aiEnabled?: boolean
    welcomeChannel?: string | null
    announcementChannel?: string | null
    updatesChannel: string
    logsChannel?: string | null
    logLevel?: $Enums.LogLevel
  }

  export type ServersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    aiEnabled?: BoolFieldUpdateOperationsInput | boolean
    welcomeChannel?: NullableStringFieldUpdateOperationsInput | string | null
    announcementChannel?: NullableStringFieldUpdateOperationsInput | string | null
    updatesChannel?: StringFieldUpdateOperationsInput | string
    logsChannel?: NullableStringFieldUpdateOperationsInput | string | null
    logLevel?: EnumLogLevelFieldUpdateOperationsInput | $Enums.LogLevel
    premiumUser?: UsersUpdateOneWithoutPremiumServersNestedInput
  }

  export type ServersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    premiumAddedBy?: NullableStringFieldUpdateOperationsInput | string | null
    aiEnabled?: BoolFieldUpdateOperationsInput | boolean
    welcomeChannel?: NullableStringFieldUpdateOperationsInput | string | null
    announcementChannel?: NullableStringFieldUpdateOperationsInput | string | null
    updatesChannel?: StringFieldUpdateOperationsInput | string
    logsChannel?: NullableStringFieldUpdateOperationsInput | string | null
    logLevel?: EnumLogLevelFieldUpdateOperationsInput | $Enums.LogLevel
  }

  export type ServersCreateManyInput = {
    id: string
    name: string
    ownerId: string
    isPremium?: boolean
    premiumAddedBy?: string | null
    aiEnabled?: boolean
    welcomeChannel?: string | null
    announcementChannel?: string | null
    updatesChannel: string
    logsChannel?: string | null
    logLevel?: $Enums.LogLevel
  }

  export type ServersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    aiEnabled?: BoolFieldUpdateOperationsInput | boolean
    welcomeChannel?: NullableStringFieldUpdateOperationsInput | string | null
    announcementChannel?: NullableStringFieldUpdateOperationsInput | string | null
    updatesChannel?: StringFieldUpdateOperationsInput | string
    logsChannel?: NullableStringFieldUpdateOperationsInput | string | null
    logLevel?: EnumLogLevelFieldUpdateOperationsInput | $Enums.LogLevel
  }

  export type ServersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    premiumAddedBy?: NullableStringFieldUpdateOperationsInput | string | null
    aiEnabled?: BoolFieldUpdateOperationsInput | boolean
    welcomeChannel?: NullableStringFieldUpdateOperationsInput | string | null
    announcementChannel?: NullableStringFieldUpdateOperationsInput | string | null
    updatesChannel?: StringFieldUpdateOperationsInput | string
    logsChannel?: NullableStringFieldUpdateOperationsInput | string | null
    logLevel?: EnumLogLevelFieldUpdateOperationsInput | $Enums.LogLevel
  }

  export type PremiumSubscriptionsCreateInput = {
    tier: $Enums.Plans
    startDate?: Date | string
    endDate?: Date | string
    source: $Enums.Sources
    user: UsersCreateNestedOneWithoutPremiumSubscriptionsInput
  }

  export type PremiumSubscriptionsUncheckedCreateInput = {
    id: string
    tier: $Enums.Plans
    startDate?: Date | string
    endDate?: Date | string
    source: $Enums.Sources
  }

  export type PremiumSubscriptionsUpdateInput = {
    tier?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: EnumSourcesFieldUpdateOperationsInput | $Enums.Sources
    user?: UsersUpdateOneRequiredWithoutPremiumSubscriptionsNestedInput
  }

  export type PremiumSubscriptionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tier?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: EnumSourcesFieldUpdateOperationsInput | $Enums.Sources
  }

  export type PremiumSubscriptionsCreateManyInput = {
    id: string
    tier: $Enums.Plans
    startDate?: Date | string
    endDate?: Date | string
    source: $Enums.Sources
  }

  export type PremiumSubscriptionsUpdateManyMutationInput = {
    tier?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: EnumSourcesFieldUpdateOperationsInput | $Enums.Sources
  }

  export type PremiumSubscriptionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tier?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: EnumSourcesFieldUpdateOperationsInput | $Enums.Sources
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumPlansFilter<$PrismaModel = never> = {
    equals?: $Enums.Plans | EnumPlansFieldRefInput<$PrismaModel>
    in?: $Enums.Plans[] | ListEnumPlansFieldRefInput<$PrismaModel>
    notIn?: $Enums.Plans[] | ListEnumPlansFieldRefInput<$PrismaModel>
    not?: NestedEnumPlansFilter<$PrismaModel> | $Enums.Plans
  }

  export type PremiumSubscriptionsNullableScalarRelationFilter = {
    is?: PremiumSubscriptionsWhereInput | null
    isNot?: PremiumSubscriptionsWhereInput | null
  }

  export type LimitsNullableScalarRelationFilter = {
    is?: LimitsWhereInput | null
    isNot?: LimitsWhereInput | null
  }

  export type ServersListRelationFilter = {
    every?: ServersWhereInput
    some?: ServersWhereInput
    none?: ServersWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ServersOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsersCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    extId?: SortOrder
    discordId?: SortOrder
    plan?: SortOrder
  }

  export type UsersMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    extId?: SortOrder
    discordId?: SortOrder
    plan?: SortOrder
  }

  export type UsersMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    extId?: SortOrder
    discordId?: SortOrder
    plan?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumPlansWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Plans | EnumPlansFieldRefInput<$PrismaModel>
    in?: $Enums.Plans[] | ListEnumPlansFieldRefInput<$PrismaModel>
    notIn?: $Enums.Plans[] | ListEnumPlansFieldRefInput<$PrismaModel>
    not?: NestedEnumPlansWithAggregatesFilter<$PrismaModel> | $Enums.Plans
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlansFilter<$PrismaModel>
    _max?: NestedEnumPlansFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UsersScalarRelationFilter = {
    is?: UsersWhereInput
    isNot?: UsersWhereInput
  }

  export type LimitsCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    aiUsed?: SortOrder
    aiLimit?: SortOrder
    additionalMessages?: SortOrder
    premiumServers?: SortOrder
    premiumServerLimmit?: SortOrder
  }

  export type LimitsAvgOrderByAggregateInput = {
    aiUsed?: SortOrder
    aiLimit?: SortOrder
    additionalMessages?: SortOrder
    premiumServers?: SortOrder
    premiumServerLimmit?: SortOrder
  }

  export type LimitsMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    aiUsed?: SortOrder
    aiLimit?: SortOrder
    additionalMessages?: SortOrder
    premiumServers?: SortOrder
    premiumServerLimmit?: SortOrder
  }

  export type LimitsMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    aiUsed?: SortOrder
    aiLimit?: SortOrder
    additionalMessages?: SortOrder
    premiumServers?: SortOrder
    premiumServerLimmit?: SortOrder
  }

  export type LimitsSumOrderByAggregateInput = {
    aiUsed?: SortOrder
    aiLimit?: SortOrder
    additionalMessages?: SortOrder
    premiumServers?: SortOrder
    premiumServerLimmit?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumLogLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.LogLevel | EnumLogLevelFieldRefInput<$PrismaModel>
    in?: $Enums.LogLevel[] | ListEnumLogLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogLevel[] | ListEnumLogLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumLogLevelFilter<$PrismaModel> | $Enums.LogLevel
  }

  export type UsersNullableScalarRelationFilter = {
    is?: UsersWhereInput | null
    isNot?: UsersWhereInput | null
  }

  export type ServersCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    isPremium?: SortOrder
    premiumAddedBy?: SortOrder
    aiEnabled?: SortOrder
    welcomeChannel?: SortOrder
    announcementChannel?: SortOrder
    updatesChannel?: SortOrder
    logsChannel?: SortOrder
    logLevel?: SortOrder
  }

  export type ServersMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    isPremium?: SortOrder
    premiumAddedBy?: SortOrder
    aiEnabled?: SortOrder
    welcomeChannel?: SortOrder
    announcementChannel?: SortOrder
    updatesChannel?: SortOrder
    logsChannel?: SortOrder
    logLevel?: SortOrder
  }

  export type ServersMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    isPremium?: SortOrder
    premiumAddedBy?: SortOrder
    aiEnabled?: SortOrder
    welcomeChannel?: SortOrder
    announcementChannel?: SortOrder
    updatesChannel?: SortOrder
    logsChannel?: SortOrder
    logLevel?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumLogLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LogLevel | EnumLogLevelFieldRefInput<$PrismaModel>
    in?: $Enums.LogLevel[] | ListEnumLogLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogLevel[] | ListEnumLogLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumLogLevelWithAggregatesFilter<$PrismaModel> | $Enums.LogLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLogLevelFilter<$PrismaModel>
    _max?: NestedEnumLogLevelFilter<$PrismaModel>
  }

  export type EnumSourcesFilter<$PrismaModel = never> = {
    equals?: $Enums.Sources | EnumSourcesFieldRefInput<$PrismaModel>
    in?: $Enums.Sources[] | ListEnumSourcesFieldRefInput<$PrismaModel>
    notIn?: $Enums.Sources[] | ListEnumSourcesFieldRefInput<$PrismaModel>
    not?: NestedEnumSourcesFilter<$PrismaModel> | $Enums.Sources
  }

  export type PremiumSubscriptionsCountOrderByAggregateInput = {
    id?: SortOrder
    tier?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    source?: SortOrder
  }

  export type PremiumSubscriptionsMaxOrderByAggregateInput = {
    id?: SortOrder
    tier?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    source?: SortOrder
  }

  export type PremiumSubscriptionsMinOrderByAggregateInput = {
    id?: SortOrder
    tier?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    source?: SortOrder
  }

  export type EnumSourcesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Sources | EnumSourcesFieldRefInput<$PrismaModel>
    in?: $Enums.Sources[] | ListEnumSourcesFieldRefInput<$PrismaModel>
    notIn?: $Enums.Sources[] | ListEnumSourcesFieldRefInput<$PrismaModel>
    not?: NestedEnumSourcesWithAggregatesFilter<$PrismaModel> | $Enums.Sources
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSourcesFilter<$PrismaModel>
    _max?: NestedEnumSourcesFilter<$PrismaModel>
  }

  export type PremiumSubscriptionsCreateNestedOneWithoutUserInput = {
    create?: XOR<PremiumSubscriptionsCreateWithoutUserInput, PremiumSubscriptionsUncheckedCreateWithoutUserInput>
    connectOrCreate?: PremiumSubscriptionsCreateOrConnectWithoutUserInput
    connect?: PremiumSubscriptionsWhereUniqueInput
  }

  export type LimitsCreateNestedOneWithoutUserInput = {
    create?: XOR<LimitsCreateWithoutUserInput, LimitsUncheckedCreateWithoutUserInput>
    connectOrCreate?: LimitsCreateOrConnectWithoutUserInput
    connect?: LimitsWhereUniqueInput
  }

  export type ServersCreateNestedManyWithoutPremiumUserInput = {
    create?: XOR<ServersCreateWithoutPremiumUserInput, ServersUncheckedCreateWithoutPremiumUserInput> | ServersCreateWithoutPremiumUserInput[] | ServersUncheckedCreateWithoutPremiumUserInput[]
    connectOrCreate?: ServersCreateOrConnectWithoutPremiumUserInput | ServersCreateOrConnectWithoutPremiumUserInput[]
    createMany?: ServersCreateManyPremiumUserInputEnvelope
    connect?: ServersWhereUniqueInput | ServersWhereUniqueInput[]
  }

  export type PremiumSubscriptionsUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<PremiumSubscriptionsCreateWithoutUserInput, PremiumSubscriptionsUncheckedCreateWithoutUserInput>
    connectOrCreate?: PremiumSubscriptionsCreateOrConnectWithoutUserInput
    connect?: PremiumSubscriptionsWhereUniqueInput
  }

  export type LimitsUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<LimitsCreateWithoutUserInput, LimitsUncheckedCreateWithoutUserInput>
    connectOrCreate?: LimitsCreateOrConnectWithoutUserInput
    connect?: LimitsWhereUniqueInput
  }

  export type ServersUncheckedCreateNestedManyWithoutPremiumUserInput = {
    create?: XOR<ServersCreateWithoutPremiumUserInput, ServersUncheckedCreateWithoutPremiumUserInput> | ServersCreateWithoutPremiumUserInput[] | ServersUncheckedCreateWithoutPremiumUserInput[]
    connectOrCreate?: ServersCreateOrConnectWithoutPremiumUserInput | ServersCreateOrConnectWithoutPremiumUserInput[]
    createMany?: ServersCreateManyPremiumUserInputEnvelope
    connect?: ServersWhereUniqueInput | ServersWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumPlansFieldUpdateOperationsInput = {
    set?: $Enums.Plans
  }

  export type PremiumSubscriptionsUpdateOneWithoutUserNestedInput = {
    create?: XOR<PremiumSubscriptionsCreateWithoutUserInput, PremiumSubscriptionsUncheckedCreateWithoutUserInput>
    connectOrCreate?: PremiumSubscriptionsCreateOrConnectWithoutUserInput
    upsert?: PremiumSubscriptionsUpsertWithoutUserInput
    disconnect?: PremiumSubscriptionsWhereInput | boolean
    delete?: PremiumSubscriptionsWhereInput | boolean
    connect?: PremiumSubscriptionsWhereUniqueInput
    update?: XOR<XOR<PremiumSubscriptionsUpdateToOneWithWhereWithoutUserInput, PremiumSubscriptionsUpdateWithoutUserInput>, PremiumSubscriptionsUncheckedUpdateWithoutUserInput>
  }

  export type LimitsUpdateOneWithoutUserNestedInput = {
    create?: XOR<LimitsCreateWithoutUserInput, LimitsUncheckedCreateWithoutUserInput>
    connectOrCreate?: LimitsCreateOrConnectWithoutUserInput
    upsert?: LimitsUpsertWithoutUserInput
    disconnect?: LimitsWhereInput | boolean
    delete?: LimitsWhereInput | boolean
    connect?: LimitsWhereUniqueInput
    update?: XOR<XOR<LimitsUpdateToOneWithWhereWithoutUserInput, LimitsUpdateWithoutUserInput>, LimitsUncheckedUpdateWithoutUserInput>
  }

  export type ServersUpdateManyWithoutPremiumUserNestedInput = {
    create?: XOR<ServersCreateWithoutPremiumUserInput, ServersUncheckedCreateWithoutPremiumUserInput> | ServersCreateWithoutPremiumUserInput[] | ServersUncheckedCreateWithoutPremiumUserInput[]
    connectOrCreate?: ServersCreateOrConnectWithoutPremiumUserInput | ServersCreateOrConnectWithoutPremiumUserInput[]
    upsert?: ServersUpsertWithWhereUniqueWithoutPremiumUserInput | ServersUpsertWithWhereUniqueWithoutPremiumUserInput[]
    createMany?: ServersCreateManyPremiumUserInputEnvelope
    set?: ServersWhereUniqueInput | ServersWhereUniqueInput[]
    disconnect?: ServersWhereUniqueInput | ServersWhereUniqueInput[]
    delete?: ServersWhereUniqueInput | ServersWhereUniqueInput[]
    connect?: ServersWhereUniqueInput | ServersWhereUniqueInput[]
    update?: ServersUpdateWithWhereUniqueWithoutPremiumUserInput | ServersUpdateWithWhereUniqueWithoutPremiumUserInput[]
    updateMany?: ServersUpdateManyWithWhereWithoutPremiumUserInput | ServersUpdateManyWithWhereWithoutPremiumUserInput[]
    deleteMany?: ServersScalarWhereInput | ServersScalarWhereInput[]
  }

  export type PremiumSubscriptionsUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<PremiumSubscriptionsCreateWithoutUserInput, PremiumSubscriptionsUncheckedCreateWithoutUserInput>
    connectOrCreate?: PremiumSubscriptionsCreateOrConnectWithoutUserInput
    upsert?: PremiumSubscriptionsUpsertWithoutUserInput
    disconnect?: PremiumSubscriptionsWhereInput | boolean
    delete?: PremiumSubscriptionsWhereInput | boolean
    connect?: PremiumSubscriptionsWhereUniqueInput
    update?: XOR<XOR<PremiumSubscriptionsUpdateToOneWithWhereWithoutUserInput, PremiumSubscriptionsUpdateWithoutUserInput>, PremiumSubscriptionsUncheckedUpdateWithoutUserInput>
  }

  export type LimitsUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<LimitsCreateWithoutUserInput, LimitsUncheckedCreateWithoutUserInput>
    connectOrCreate?: LimitsCreateOrConnectWithoutUserInput
    upsert?: LimitsUpsertWithoutUserInput
    disconnect?: LimitsWhereInput | boolean
    delete?: LimitsWhereInput | boolean
    connect?: LimitsWhereUniqueInput
    update?: XOR<XOR<LimitsUpdateToOneWithWhereWithoutUserInput, LimitsUpdateWithoutUserInput>, LimitsUncheckedUpdateWithoutUserInput>
  }

  export type ServersUncheckedUpdateManyWithoutPremiumUserNestedInput = {
    create?: XOR<ServersCreateWithoutPremiumUserInput, ServersUncheckedCreateWithoutPremiumUserInput> | ServersCreateWithoutPremiumUserInput[] | ServersUncheckedCreateWithoutPremiumUserInput[]
    connectOrCreate?: ServersCreateOrConnectWithoutPremiumUserInput | ServersCreateOrConnectWithoutPremiumUserInput[]
    upsert?: ServersUpsertWithWhereUniqueWithoutPremiumUserInput | ServersUpsertWithWhereUniqueWithoutPremiumUserInput[]
    createMany?: ServersCreateManyPremiumUserInputEnvelope
    set?: ServersWhereUniqueInput | ServersWhereUniqueInput[]
    disconnect?: ServersWhereUniqueInput | ServersWhereUniqueInput[]
    delete?: ServersWhereUniqueInput | ServersWhereUniqueInput[]
    connect?: ServersWhereUniqueInput | ServersWhereUniqueInput[]
    update?: ServersUpdateWithWhereUniqueWithoutPremiumUserInput | ServersUpdateWithWhereUniqueWithoutPremiumUserInput[]
    updateMany?: ServersUpdateManyWithWhereWithoutPremiumUserInput | ServersUpdateManyWithWhereWithoutPremiumUserInput[]
    deleteMany?: ServersScalarWhereInput | ServersScalarWhereInput[]
  }

  export type UsersCreateNestedOneWithoutLimitsInput = {
    create?: XOR<UsersCreateWithoutLimitsInput, UsersUncheckedCreateWithoutLimitsInput>
    connectOrCreate?: UsersCreateOrConnectWithoutLimitsInput
    connect?: UsersWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UsersUpdateOneRequiredWithoutLimitsNestedInput = {
    create?: XOR<UsersCreateWithoutLimitsInput, UsersUncheckedCreateWithoutLimitsInput>
    connectOrCreate?: UsersCreateOrConnectWithoutLimitsInput
    upsert?: UsersUpsertWithoutLimitsInput
    connect?: UsersWhereUniqueInput
    update?: XOR<XOR<UsersUpdateToOneWithWhereWithoutLimitsInput, UsersUpdateWithoutLimitsInput>, UsersUncheckedUpdateWithoutLimitsInput>
  }

  export type UsersCreateNestedOneWithoutPremiumServersInput = {
    create?: XOR<UsersCreateWithoutPremiumServersInput, UsersUncheckedCreateWithoutPremiumServersInput>
    connectOrCreate?: UsersCreateOrConnectWithoutPremiumServersInput
    connect?: UsersWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumLogLevelFieldUpdateOperationsInput = {
    set?: $Enums.LogLevel
  }

  export type UsersUpdateOneWithoutPremiumServersNestedInput = {
    create?: XOR<UsersCreateWithoutPremiumServersInput, UsersUncheckedCreateWithoutPremiumServersInput>
    connectOrCreate?: UsersCreateOrConnectWithoutPremiumServersInput
    upsert?: UsersUpsertWithoutPremiumServersInput
    disconnect?: UsersWhereInput | boolean
    delete?: UsersWhereInput | boolean
    connect?: UsersWhereUniqueInput
    update?: XOR<XOR<UsersUpdateToOneWithWhereWithoutPremiumServersInput, UsersUpdateWithoutPremiumServersInput>, UsersUncheckedUpdateWithoutPremiumServersInput>
  }

  export type UsersCreateNestedOneWithoutPremiumSubscriptionsInput = {
    create?: XOR<UsersCreateWithoutPremiumSubscriptionsInput, UsersUncheckedCreateWithoutPremiumSubscriptionsInput>
    connectOrCreate?: UsersCreateOrConnectWithoutPremiumSubscriptionsInput
    connect?: UsersWhereUniqueInput
  }

  export type EnumSourcesFieldUpdateOperationsInput = {
    set?: $Enums.Sources
  }

  export type UsersUpdateOneRequiredWithoutPremiumSubscriptionsNestedInput = {
    create?: XOR<UsersCreateWithoutPremiumSubscriptionsInput, UsersUncheckedCreateWithoutPremiumSubscriptionsInput>
    connectOrCreate?: UsersCreateOrConnectWithoutPremiumSubscriptionsInput
    upsert?: UsersUpsertWithoutPremiumSubscriptionsInput
    connect?: UsersWhereUniqueInput
    update?: XOR<XOR<UsersUpdateToOneWithWhereWithoutPremiumSubscriptionsInput, UsersUpdateWithoutPremiumSubscriptionsInput>, UsersUncheckedUpdateWithoutPremiumSubscriptionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumPlansFilter<$PrismaModel = never> = {
    equals?: $Enums.Plans | EnumPlansFieldRefInput<$PrismaModel>
    in?: $Enums.Plans[] | ListEnumPlansFieldRefInput<$PrismaModel>
    notIn?: $Enums.Plans[] | ListEnumPlansFieldRefInput<$PrismaModel>
    not?: NestedEnumPlansFilter<$PrismaModel> | $Enums.Plans
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumPlansWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Plans | EnumPlansFieldRefInput<$PrismaModel>
    in?: $Enums.Plans[] | ListEnumPlansFieldRefInput<$PrismaModel>
    notIn?: $Enums.Plans[] | ListEnumPlansFieldRefInput<$PrismaModel>
    not?: NestedEnumPlansWithAggregatesFilter<$PrismaModel> | $Enums.Plans
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlansFilter<$PrismaModel>
    _max?: NestedEnumPlansFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumLogLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.LogLevel | EnumLogLevelFieldRefInput<$PrismaModel>
    in?: $Enums.LogLevel[] | ListEnumLogLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogLevel[] | ListEnumLogLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumLogLevelFilter<$PrismaModel> | $Enums.LogLevel
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumLogLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LogLevel | EnumLogLevelFieldRefInput<$PrismaModel>
    in?: $Enums.LogLevel[] | ListEnumLogLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogLevel[] | ListEnumLogLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumLogLevelWithAggregatesFilter<$PrismaModel> | $Enums.LogLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLogLevelFilter<$PrismaModel>
    _max?: NestedEnumLogLevelFilter<$PrismaModel>
  }

  export type NestedEnumSourcesFilter<$PrismaModel = never> = {
    equals?: $Enums.Sources | EnumSourcesFieldRefInput<$PrismaModel>
    in?: $Enums.Sources[] | ListEnumSourcesFieldRefInput<$PrismaModel>
    notIn?: $Enums.Sources[] | ListEnumSourcesFieldRefInput<$PrismaModel>
    not?: NestedEnumSourcesFilter<$PrismaModel> | $Enums.Sources
  }

  export type NestedEnumSourcesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Sources | EnumSourcesFieldRefInput<$PrismaModel>
    in?: $Enums.Sources[] | ListEnumSourcesFieldRefInput<$PrismaModel>
    notIn?: $Enums.Sources[] | ListEnumSourcesFieldRefInput<$PrismaModel>
    not?: NestedEnumSourcesWithAggregatesFilter<$PrismaModel> | $Enums.Sources
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSourcesFilter<$PrismaModel>
    _max?: NestedEnumSourcesFilter<$PrismaModel>
  }

  export type PremiumSubscriptionsCreateWithoutUserInput = {
    tier: $Enums.Plans
    startDate?: Date | string
    endDate?: Date | string
    source: $Enums.Sources
  }

  export type PremiumSubscriptionsUncheckedCreateWithoutUserInput = {
    tier: $Enums.Plans
    startDate?: Date | string
    endDate?: Date | string
    source: $Enums.Sources
  }

  export type PremiumSubscriptionsCreateOrConnectWithoutUserInput = {
    where: PremiumSubscriptionsWhereUniqueInput
    create: XOR<PremiumSubscriptionsCreateWithoutUserInput, PremiumSubscriptionsUncheckedCreateWithoutUserInput>
  }

  export type LimitsCreateWithoutUserInput = {
    date: Date | string
    aiUsed?: number
    aiLimit?: number
    additionalMessages?: number
    premiumServers?: number
    premiumServerLimmit?: number
  }

  export type LimitsUncheckedCreateWithoutUserInput = {
    date: Date | string
    aiUsed?: number
    aiLimit?: number
    additionalMessages?: number
    premiumServers?: number
    premiumServerLimmit?: number
  }

  export type LimitsCreateOrConnectWithoutUserInput = {
    where: LimitsWhereUniqueInput
    create: XOR<LimitsCreateWithoutUserInput, LimitsUncheckedCreateWithoutUserInput>
  }

  export type ServersCreateWithoutPremiumUserInput = {
    id: string
    name: string
    ownerId: string
    isPremium?: boolean
    aiEnabled?: boolean
    welcomeChannel?: string | null
    announcementChannel?: string | null
    updatesChannel: string
    logsChannel?: string | null
    logLevel?: $Enums.LogLevel
  }

  export type ServersUncheckedCreateWithoutPremiumUserInput = {
    id: string
    name: string
    ownerId: string
    isPremium?: boolean
    aiEnabled?: boolean
    welcomeChannel?: string | null
    announcementChannel?: string | null
    updatesChannel: string
    logsChannel?: string | null
    logLevel?: $Enums.LogLevel
  }

  export type ServersCreateOrConnectWithoutPremiumUserInput = {
    where: ServersWhereUniqueInput
    create: XOR<ServersCreateWithoutPremiumUserInput, ServersUncheckedCreateWithoutPremiumUserInput>
  }

  export type ServersCreateManyPremiumUserInputEnvelope = {
    data: ServersCreateManyPremiumUserInput | ServersCreateManyPremiumUserInput[]
    skipDuplicates?: boolean
  }

  export type PremiumSubscriptionsUpsertWithoutUserInput = {
    update: XOR<PremiumSubscriptionsUpdateWithoutUserInput, PremiumSubscriptionsUncheckedUpdateWithoutUserInput>
    create: XOR<PremiumSubscriptionsCreateWithoutUserInput, PremiumSubscriptionsUncheckedCreateWithoutUserInput>
    where?: PremiumSubscriptionsWhereInput
  }

  export type PremiumSubscriptionsUpdateToOneWithWhereWithoutUserInput = {
    where?: PremiumSubscriptionsWhereInput
    data: XOR<PremiumSubscriptionsUpdateWithoutUserInput, PremiumSubscriptionsUncheckedUpdateWithoutUserInput>
  }

  export type PremiumSubscriptionsUpdateWithoutUserInput = {
    tier?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: EnumSourcesFieldUpdateOperationsInput | $Enums.Sources
  }

  export type PremiumSubscriptionsUncheckedUpdateWithoutUserInput = {
    tier?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: EnumSourcesFieldUpdateOperationsInput | $Enums.Sources
  }

  export type LimitsUpsertWithoutUserInput = {
    update: XOR<LimitsUpdateWithoutUserInput, LimitsUncheckedUpdateWithoutUserInput>
    create: XOR<LimitsCreateWithoutUserInput, LimitsUncheckedCreateWithoutUserInput>
    where?: LimitsWhereInput
  }

  export type LimitsUpdateToOneWithWhereWithoutUserInput = {
    where?: LimitsWhereInput
    data: XOR<LimitsUpdateWithoutUserInput, LimitsUncheckedUpdateWithoutUserInput>
  }

  export type LimitsUpdateWithoutUserInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    aiUsed?: IntFieldUpdateOperationsInput | number
    aiLimit?: IntFieldUpdateOperationsInput | number
    additionalMessages?: IntFieldUpdateOperationsInput | number
    premiumServers?: IntFieldUpdateOperationsInput | number
    premiumServerLimmit?: IntFieldUpdateOperationsInput | number
  }

  export type LimitsUncheckedUpdateWithoutUserInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    aiUsed?: IntFieldUpdateOperationsInput | number
    aiLimit?: IntFieldUpdateOperationsInput | number
    additionalMessages?: IntFieldUpdateOperationsInput | number
    premiumServers?: IntFieldUpdateOperationsInput | number
    premiumServerLimmit?: IntFieldUpdateOperationsInput | number
  }

  export type ServersUpsertWithWhereUniqueWithoutPremiumUserInput = {
    where: ServersWhereUniqueInput
    update: XOR<ServersUpdateWithoutPremiumUserInput, ServersUncheckedUpdateWithoutPremiumUserInput>
    create: XOR<ServersCreateWithoutPremiumUserInput, ServersUncheckedCreateWithoutPremiumUserInput>
  }

  export type ServersUpdateWithWhereUniqueWithoutPremiumUserInput = {
    where: ServersWhereUniqueInput
    data: XOR<ServersUpdateWithoutPremiumUserInput, ServersUncheckedUpdateWithoutPremiumUserInput>
  }

  export type ServersUpdateManyWithWhereWithoutPremiumUserInput = {
    where: ServersScalarWhereInput
    data: XOR<ServersUpdateManyMutationInput, ServersUncheckedUpdateManyWithoutPremiumUserInput>
  }

  export type ServersScalarWhereInput = {
    AND?: ServersScalarWhereInput | ServersScalarWhereInput[]
    OR?: ServersScalarWhereInput[]
    NOT?: ServersScalarWhereInput | ServersScalarWhereInput[]
    id?: StringFilter<"Servers"> | string
    name?: StringFilter<"Servers"> | string
    ownerId?: StringFilter<"Servers"> | string
    isPremium?: BoolFilter<"Servers"> | boolean
    premiumAddedBy?: StringNullableFilter<"Servers"> | string | null
    aiEnabled?: BoolFilter<"Servers"> | boolean
    welcomeChannel?: StringNullableFilter<"Servers"> | string | null
    announcementChannel?: StringNullableFilter<"Servers"> | string | null
    updatesChannel?: StringFilter<"Servers"> | string
    logsChannel?: StringNullableFilter<"Servers"> | string | null
    logLevel?: EnumLogLevelFilter<"Servers"> | $Enums.LogLevel
  }

  export type UsersCreateWithoutLimitsInput = {
    id?: string
    username: string
    email?: string | null
    extId?: string | null
    discordId: string
    plan?: $Enums.Plans
    premiumSubscriptions?: PremiumSubscriptionsCreateNestedOneWithoutUserInput
    premiumServers?: ServersCreateNestedManyWithoutPremiumUserInput
  }

  export type UsersUncheckedCreateWithoutLimitsInput = {
    id?: string
    username: string
    email?: string | null
    extId?: string | null
    discordId: string
    plan?: $Enums.Plans
    premiumSubscriptions?: PremiumSubscriptionsUncheckedCreateNestedOneWithoutUserInput
    premiumServers?: ServersUncheckedCreateNestedManyWithoutPremiumUserInput
  }

  export type UsersCreateOrConnectWithoutLimitsInput = {
    where: UsersWhereUniqueInput
    create: XOR<UsersCreateWithoutLimitsInput, UsersUncheckedCreateWithoutLimitsInput>
  }

  export type UsersUpsertWithoutLimitsInput = {
    update: XOR<UsersUpdateWithoutLimitsInput, UsersUncheckedUpdateWithoutLimitsInput>
    create: XOR<UsersCreateWithoutLimitsInput, UsersUncheckedCreateWithoutLimitsInput>
    where?: UsersWhereInput
  }

  export type UsersUpdateToOneWithWhereWithoutLimitsInput = {
    where?: UsersWhereInput
    data: XOR<UsersUpdateWithoutLimitsInput, UsersUncheckedUpdateWithoutLimitsInput>
  }

  export type UsersUpdateWithoutLimitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    extId?: NullableStringFieldUpdateOperationsInput | string | null
    discordId?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
    premiumSubscriptions?: PremiumSubscriptionsUpdateOneWithoutUserNestedInput
    premiumServers?: ServersUpdateManyWithoutPremiumUserNestedInput
  }

  export type UsersUncheckedUpdateWithoutLimitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    extId?: NullableStringFieldUpdateOperationsInput | string | null
    discordId?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
    premiumSubscriptions?: PremiumSubscriptionsUncheckedUpdateOneWithoutUserNestedInput
    premiumServers?: ServersUncheckedUpdateManyWithoutPremiumUserNestedInput
  }

  export type UsersCreateWithoutPremiumServersInput = {
    id?: string
    username: string
    email?: string | null
    extId?: string | null
    discordId: string
    plan?: $Enums.Plans
    premiumSubscriptions?: PremiumSubscriptionsCreateNestedOneWithoutUserInput
    limits?: LimitsCreateNestedOneWithoutUserInput
  }

  export type UsersUncheckedCreateWithoutPremiumServersInput = {
    id?: string
    username: string
    email?: string | null
    extId?: string | null
    discordId: string
    plan?: $Enums.Plans
    premiumSubscriptions?: PremiumSubscriptionsUncheckedCreateNestedOneWithoutUserInput
    limits?: LimitsUncheckedCreateNestedOneWithoutUserInput
  }

  export type UsersCreateOrConnectWithoutPremiumServersInput = {
    where: UsersWhereUniqueInput
    create: XOR<UsersCreateWithoutPremiumServersInput, UsersUncheckedCreateWithoutPremiumServersInput>
  }

  export type UsersUpsertWithoutPremiumServersInput = {
    update: XOR<UsersUpdateWithoutPremiumServersInput, UsersUncheckedUpdateWithoutPremiumServersInput>
    create: XOR<UsersCreateWithoutPremiumServersInput, UsersUncheckedCreateWithoutPremiumServersInput>
    where?: UsersWhereInput
  }

  export type UsersUpdateToOneWithWhereWithoutPremiumServersInput = {
    where?: UsersWhereInput
    data: XOR<UsersUpdateWithoutPremiumServersInput, UsersUncheckedUpdateWithoutPremiumServersInput>
  }

  export type UsersUpdateWithoutPremiumServersInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    extId?: NullableStringFieldUpdateOperationsInput | string | null
    discordId?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
    premiumSubscriptions?: PremiumSubscriptionsUpdateOneWithoutUserNestedInput
    limits?: LimitsUpdateOneWithoutUserNestedInput
  }

  export type UsersUncheckedUpdateWithoutPremiumServersInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    extId?: NullableStringFieldUpdateOperationsInput | string | null
    discordId?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
    premiumSubscriptions?: PremiumSubscriptionsUncheckedUpdateOneWithoutUserNestedInput
    limits?: LimitsUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UsersCreateWithoutPremiumSubscriptionsInput = {
    id?: string
    username: string
    email?: string | null
    extId?: string | null
    discordId: string
    plan?: $Enums.Plans
    limits?: LimitsCreateNestedOneWithoutUserInput
    premiumServers?: ServersCreateNestedManyWithoutPremiumUserInput
  }

  export type UsersUncheckedCreateWithoutPremiumSubscriptionsInput = {
    id?: string
    username: string
    email?: string | null
    extId?: string | null
    discordId: string
    plan?: $Enums.Plans
    limits?: LimitsUncheckedCreateNestedOneWithoutUserInput
    premiumServers?: ServersUncheckedCreateNestedManyWithoutPremiumUserInput
  }

  export type UsersCreateOrConnectWithoutPremiumSubscriptionsInput = {
    where: UsersWhereUniqueInput
    create: XOR<UsersCreateWithoutPremiumSubscriptionsInput, UsersUncheckedCreateWithoutPremiumSubscriptionsInput>
  }

  export type UsersUpsertWithoutPremiumSubscriptionsInput = {
    update: XOR<UsersUpdateWithoutPremiumSubscriptionsInput, UsersUncheckedUpdateWithoutPremiumSubscriptionsInput>
    create: XOR<UsersCreateWithoutPremiumSubscriptionsInput, UsersUncheckedCreateWithoutPremiumSubscriptionsInput>
    where?: UsersWhereInput
  }

  export type UsersUpdateToOneWithWhereWithoutPremiumSubscriptionsInput = {
    where?: UsersWhereInput
    data: XOR<UsersUpdateWithoutPremiumSubscriptionsInput, UsersUncheckedUpdateWithoutPremiumSubscriptionsInput>
  }

  export type UsersUpdateWithoutPremiumSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    extId?: NullableStringFieldUpdateOperationsInput | string | null
    discordId?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
    limits?: LimitsUpdateOneWithoutUserNestedInput
    premiumServers?: ServersUpdateManyWithoutPremiumUserNestedInput
  }

  export type UsersUncheckedUpdateWithoutPremiumSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    extId?: NullableStringFieldUpdateOperationsInput | string | null
    discordId?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlansFieldUpdateOperationsInput | $Enums.Plans
    limits?: LimitsUncheckedUpdateOneWithoutUserNestedInput
    premiumServers?: ServersUncheckedUpdateManyWithoutPremiumUserNestedInput
  }

  export type ServersCreateManyPremiumUserInput = {
    id: string
    name: string
    ownerId: string
    isPremium?: boolean
    aiEnabled?: boolean
    welcomeChannel?: string | null
    announcementChannel?: string | null
    updatesChannel: string
    logsChannel?: string | null
    logLevel?: $Enums.LogLevel
  }

  export type ServersUpdateWithoutPremiumUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    aiEnabled?: BoolFieldUpdateOperationsInput | boolean
    welcomeChannel?: NullableStringFieldUpdateOperationsInput | string | null
    announcementChannel?: NullableStringFieldUpdateOperationsInput | string | null
    updatesChannel?: StringFieldUpdateOperationsInput | string
    logsChannel?: NullableStringFieldUpdateOperationsInput | string | null
    logLevel?: EnumLogLevelFieldUpdateOperationsInput | $Enums.LogLevel
  }

  export type ServersUncheckedUpdateWithoutPremiumUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    aiEnabled?: BoolFieldUpdateOperationsInput | boolean
    welcomeChannel?: NullableStringFieldUpdateOperationsInput | string | null
    announcementChannel?: NullableStringFieldUpdateOperationsInput | string | null
    updatesChannel?: StringFieldUpdateOperationsInput | string
    logsChannel?: NullableStringFieldUpdateOperationsInput | string | null
    logLevel?: EnumLogLevelFieldUpdateOperationsInput | $Enums.LogLevel
  }

  export type ServersUncheckedUpdateManyWithoutPremiumUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    aiEnabled?: BoolFieldUpdateOperationsInput | boolean
    welcomeChannel?: NullableStringFieldUpdateOperationsInput | string | null
    announcementChannel?: NullableStringFieldUpdateOperationsInput | string | null
    updatesChannel?: StringFieldUpdateOperationsInput | string
    logsChannel?: NullableStringFieldUpdateOperationsInput | string | null
    logLevel?: EnumLogLevelFieldUpdateOperationsInput | $Enums.LogLevel
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}