import { GraphQLError, GraphQLFieldConfig, GraphQLSchema } from 'graphql';
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { GraphQLContext } from '#gql-context';

import 'dotenv/config';

const AUTH_DIRECTIVE = 'auth' as const;
const HAS_ROLE_DIRECTIVE = 'hasRole' as const;

export const directiveTypeDefs = `#graphql
  directive @auth on FIELD | FIELD_DEFINITION
  directive @hasRole(role: [String]) on FIELD | FIELD_DEFINITION
`;

export const directiveTransformer = (schema: GraphQLSchema): GraphQLSchema =>
  mapSchema(schema, {
    [MapperKind.OBJECT_FIELD](
      fieldConfig: GraphQLFieldConfig<unknown, GraphQLContext, unknown>,
    ) {
      const { resolve } = fieldConfig;

      const authDirective = getDirective(
        schema,
        fieldConfig,
        AUTH_DIRECTIVE,
      )?.[0];

      const hasRoleDirective = getDirective(
        schema,
        fieldConfig,
        HAS_ROLE_DIRECTIVE,
      )?.[0];

      if (authDirective && resolve) {
        fieldConfig.resolve = async function (source, args, apiContext, info) {
          const context = apiContext.res.locals;
          if (info.fieldName === 'isUserLoggedIn') {
            return resolve.call(this, source, args, apiContext, info);
          }
          if (!context.authenticated) {
            throw new GraphQLError('Unauthorized');
          }
          return resolve.call(this, source, args, apiContext, info);
        };

        return fieldConfig;
      }

      if (hasRoleDirective && resolve) {
        const { role: roleArr } = hasRoleDirective;
        const role = roleArr[0];

        fieldConfig.resolve = async function (source, args, apiContext, info) {
          const context = apiContext.res.locals;
          if (!context.authenticated || !context.roles?.includes(role)) {
            throw new GraphQLError('Unauthorized');
          }

          // Call the original resolver
          return resolve.call(this, source, args, apiContext, info);
        };

        return fieldConfig;
      }
    },
  });
