import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';
import type { KoaContext } from '../types/koa';
import type { Next } from 'koa';
import type { ParsedUrlQuery } from 'querystring';

type RequestValidationSchemeInput = Partial<{
  params: ZodSchema;
  body: ZodSchema;
  query: ZodSchema;
}>;

const validate = (scheme: RequestValidationSchemeInput | null) => {
  return (ctx: KoaContext, next: Next) => {
    const errors: Record<string, unknown> = {};
  
    if (scheme?.params) {
      try {
        ctx.params = scheme.params.parse(ctx.params);
      } catch (err) {
        if (err instanceof ZodError) {
          errors.params = err.flatten();
        }
      }
    }
   
    if (scheme?.body) {
      try {
        ctx.request.body = scheme.body.parse(ctx.request.body);
      } catch (err) {
        if (err instanceof ZodError) {
          errors.body = err.flatten();
        }
      }
    }
   
    if (scheme?.query) {
      try {
        ctx.request.query = scheme.query.parse(ctx.request.query) as ParsedUrlQuery;
      } catch (err) {
        if (err instanceof ZodError) {
          errors.query = err.flatten();
        }
      }
    }
  
    if (Object.keys(errors).length > 0) {
      ctx.throw(400, 'Validation failed', {
        code: 'VALIDATION_FAILED',
        details: errors,
      });
    }

    return next();
  };
};

export default validate;
