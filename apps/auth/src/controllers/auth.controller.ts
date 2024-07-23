import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RmqInterceptor } from '@app/shared/interceptors/rmq.interceptor';
import { AuthService } from '../services/auth.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

@Controller()
@UseInterceptors(RmqInterceptor)
export class AuthController {
  public constructor(private readonly authService: AuthService) { }

  @MessagePattern({ cmd: 'login' })
  public async login(
    @Payload() credentials: AuthCredentialsDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.login(credentials);
  }

  @MessagePattern({ cmd: 'register' })
  public async register(
    @Payload() credentials: AuthCredentialsDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.register(credentials);
  }

  @MessagePattern({ cmd: 'logout' })
  public async logout(
    @Payload() refreshToken: string,
  ): Promise<{ message: string }> {
    await this.authService.logout(refreshToken);
    return { message: 'Logout successful' };
  }

  @MessagePattern({ cmd: 'refresh' })
  public async refresh(
    @Payload() refreshToken: string,
  ): Promise<AuthResponseDto> {
    return await this.authService.refresh(refreshToken);
  }
}
