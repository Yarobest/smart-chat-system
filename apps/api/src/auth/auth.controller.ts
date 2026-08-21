import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a user, then require a separate login' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'Login successful' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('google')
  @ApiOperation({
    summary: 'Sign in with a verified HTU Google Workspace account',
  })
  googleLogin(@Body() body: unknown) {
    return this.authService.googleLogin(body);
  }

  @Post('google/complete-profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Complete a first-time Google user academic profile',
  })
  completeGoogleProfile(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: unknown,
  ) {
    return this.authService.completeGoogleProfile(
      this.getBearerToken(authorization),
      body,
    );
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Send a password reset code when the account exists',
  })
  forgotPassword(@Body() body: unknown) {
    return this.authService.forgotPassword(body);
  }

  @Post('verify-reset-code')
  @ApiOperation({ summary: 'Verify a password reset code' })
  verifyResetCode(@Body() body: unknown) {
    return this.authService.verifyResetCode(body);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset a password with a valid email code' })
  resetPassword(@Body() body: unknown) {
    return this.authService.resetPassword(body);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke the current bearer token' })
  @ApiResponse({ status: 201, description: 'Logout successful' })
  logout(@Headers('authorization') authorization?: string) {
    return this.authService.logout(this.getBearerToken(authorization));
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user returned' })
  async me(@Headers('authorization') authorization?: string) {
    const session = await this.authService.authenticate(
      this.getBearerToken(authorization),
    );

    return {
      user: this.authService.toPublicUser(session.user),
    };
  }

  private getBearerToken(authorization?: string) {
    if (!authorization?.startsWith('Bearer ')) {
      return undefined;
    }

    return authorization.slice('Bearer '.length).trim();
  }
}
