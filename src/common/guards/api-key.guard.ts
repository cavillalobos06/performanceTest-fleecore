import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * GUARD DE API KEY: para integraciones externas.
 * Lee el header "x-api-key" y lo compara con API_KEYS (variable de entorno, separadas por coma).
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const validKeys = (this.config.get<string>('API_KEYS') ?? '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    if (!apiKey || !validKeys.includes(apiKey)) {
      throw new UnauthorizedException('API Key inválida o no proporcionada');
    }
    return true;
  }
}
