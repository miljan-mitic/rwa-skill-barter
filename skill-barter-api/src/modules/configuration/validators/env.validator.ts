import { plainToClass } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  validateSync,
} from 'class-validator';

export class EnvVariables {
  @IsOptional()
  @IsPositive()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  CLIENT_APP_URL: string;

  @IsNotEmpty()
  @IsString()
  DOCKER_DB_HOST: string;

  @IsNotEmpty()
  @IsPositive()
  DOCKER_DB_PORT: number;

  @IsNotEmpty()
  @IsString()
  DOCKER_DB_NAME: string;

  @IsNotEmpty()
  @IsString()
  DOCKER_DB_USERNAME: string;

  @IsNotEmpty()
  @IsString()
  DOCKER_DB_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  JWT_ACCESS_SECRET_KEY: string;

  @IsNotEmpty()
  @IsString()
  JWT_ACCESS_EXPIRATION_TIME: string;
}

export function envValidator(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
