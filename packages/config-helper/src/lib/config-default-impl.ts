import { Properties } from './properties';
import { Schema } from './schema';
import { Config } from './config';
import { NormalizeSchema, NormalizedConfigDefinition, isNormalizedSchemaObject } from './normalized-schema';
import { ConfigOptions } from './config-options';
import { normalizeSchema } from './config-helper';

export class ConfigDefaultImpl<TSchema extends Schema<unknown>> implements Config<TSchema> {
	public readonly schema: NormalizeSchema<TSchema>;
	public readonly environment: NodeJS.ProcessEnv;

	private readonly originalSchema: TSchema;

	constructor(schema: TSchema, private readonly opts?: ConfigOptions) {
		this.originalSchema = schema;
		this.schema = normalizeSchema(this.originalSchema, this.opts);
		this.environment = opts?.env ?? process.env;
	}

	getSchema(): NormalizeSchema<TSchema> {
		return this.schema;
	}

	getProperties(): Properties<TSchema> {
		const processNormalizedSchemaObject = <TProp>(
			propName: string,
			obj: NormalizedConfigDefinition<TProp>
		): TProp | null => {
			const envVarVal = this.environment[obj.envVar];

			const val = obj.transformer(envVarVal);

			if (val == null && !obj.optional) {
				throw new RangeError(`${propName} (envVar: ${obj.envVar}) has to be defined`); // TODO: replace with better error, maybe Result and no throw => accumulate errors
			}
			return val;
		};

		function iterate(currentObject: NormalizeSchema<TSchema>, currentPath: string[]): Properties<TSchema>;
		function iterate<TProp>(
			currentObject: NormalizeSchema<TSchema> | NormalizedConfigDefinition<TProp>,
			currentPath: string[]
		): Properties<TSchema> | TProp | null {
			if (isNormalizedSchemaObject(currentObject)) {
				const propPath: string = currentPath.join('.');
				return processNormalizedSchemaObject(propPath, currentObject);
			} else {
				const alteredObjects: Array<NormalizeSchema<TSchema>> = Object.entries(currentObject).map((entry) => {
					const [key, value] = entry;
					let newVal = value;
					if (typeof value === 'object' && value != null) {
						newVal = iterate(value as NormalizeSchema<TSchema>, [...currentPath, key]);
					}
					return {
						[key]: newVal,
					} as NormalizeSchema<TSchema>;
				});
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Object.assign({}, ...alteredObjects);
			}
		}

		return iterate(this.schema, []);
	}
}