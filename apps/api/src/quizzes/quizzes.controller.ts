import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { QuizzesService } from './quizzes.service';

@ApiTags('Quizzes')
@ApiBearerAuth()
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly auth: AuthService, private readonly quizzes: QuizzesService) {}
  private async user(authorization?: string) {
    return (await this.auth.authenticate(authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : undefined)).user;
  }

  @Get() list(@Headers('authorization') a?: string) { return this.user(a).then((u) => this.quizzes.list(u)); }
  @Get('course-offerings') offerings(@Headers('authorization') a?: string) { return this.user(a).then((u) => this.quizzes.offerings(u)); }
  @Post() create(@Headers('authorization') a: string | undefined, @Body() b: unknown) { return this.user(a).then((u) => this.quizzes.create(u, b)); }
  @Get(':id') detail(@Headers('authorization') a: string | undefined, @Param('id') id: string) { return this.user(a).then((u) => this.quizzes.detail(u, id)); }
  @Patch(':id') update(@Headers('authorization') a: string | undefined, @Param('id') id: string, @Body() b: unknown) { return this.user(a).then((u) => this.quizzes.update(u, id, b)); }
  @Delete(':id') remove(@Headers('authorization') a: string | undefined, @Param('id') id: string) { return this.user(a).then((u) => this.quizzes.remove(u, id)); }
  @Post(':id/start') start(@Headers('authorization') a: string | undefined, @Param('id') id: string) { return this.user(a).then((u) => this.quizzes.start(u, id)); }
  @Patch('attempts/:attemptId/answer') answer(@Headers('authorization') a: string | undefined, @Param('attemptId') id: string, @Body() b: unknown) { return this.user(a).then((u) => this.quizzes.answer(u, id, b)); }
  @Post('attempts/:attemptId/submit') submit(@Headers('authorization') a: string | undefined, @Param('attemptId') id: string) { return this.user(a).then((u) => this.quizzes.submit(u, id)); }
  @Get(':id/attempts') attempts(@Headers('authorization') a: string | undefined, @Param('id') id: string) { return this.user(a).then((u) => this.quizzes.attempts(u, id)); }
  @Patch(':id/attempts/:attemptId/answers/:answerId/grade') grade(@Headers('authorization') a: string | undefined, @Param('id') id: string, @Param('attemptId') attemptId: string, @Param('answerId') answerId: string, @Body() b: unknown) { return this.user(a).then((u) => this.quizzes.grade(u, id, attemptId, answerId, b)); }
  @Post(':id/release') release(@Headers('authorization') a: string | undefined, @Param('id') id: string) { return this.user(a).then((u) => this.quizzes.release(u, id)); }
}
