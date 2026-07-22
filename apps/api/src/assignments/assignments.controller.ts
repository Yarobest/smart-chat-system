import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AssignmentsService } from './assignments.service';
import type { AssignmentUpload } from './assignments.service';

@ApiTags('Assignments')
@ApiBearerAuth()
@Controller('assignments')
export class AssignmentsController {
  constructor(
    private readonly authService: AuthService,
    private readonly assignmentsService: AssignmentsService,
  ) {}

  @Get()
  async list(@Headers('authorization') authorization?: string) {
    const { user } = await this.authService.authenticate(this.token(authorization));
    return this.assignmentsService.list(user);
  }

  @Get('course-offerings')
  async courseOfferings(@Headers('authorization') authorization?: string) {
    const { user } = await this.authService.authenticate(this.token(authorization));
    return this.assignmentsService.listCourseOfferings(user);
  }

  @Post()
  async create(@Headers('authorization') authorization: string | undefined, @Body() body: unknown) {
    const { user } = await this.authService.authenticate(this.token(authorization));
    return this.assignmentsService.create(user, body);
  }

  @Post('files')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 20 * 1024 * 1024 } }))
  async uploadFile(
    @Headers('authorization') authorization: string | undefined,
    @UploadedFile() file?: AssignmentUpload,
  ) {
    const { user } = await this.authService.authenticate(this.token(authorization));
    return this.assignmentsService.storeFile(user, file);
  }

  @Get('files/:fileId')
  async downloadFile(
    @Headers('authorization') authorization: string | undefined,
    @Param('fileId') fileId: string,
    @Res() response: Response,
  ) {
    const { user } = await this.authService.authenticate(this.token(authorization));
    const file = await this.assignmentsService.readFile(user, fileId);
    response.setHeader('Content-Type', file.mimeType);
    response.setHeader('Content-Disposition', `inline; filename="${file.name.replace(/"/g, '')}"`);
    response.send(file.buffer);
  }

  @Get(':id')
  async detail(@Headers('authorization') authorization: string | undefined, @Param('id') id: string) {
    const { user } = await this.authService.authenticate(this.token(authorization));
    return this.assignmentsService.detail(user, id);
  }

  @Patch(':id')
  async update(@Headers('authorization') authorization: string | undefined, @Param('id') id: string, @Body() body: unknown) {
    const { user } = await this.authService.authenticate(this.token(authorization));
    return this.assignmentsService.update(user, id, body);
  }

  @Delete(':id')
  async remove(@Headers('authorization') authorization: string | undefined, @Param('id') id: string) {
    const { user } = await this.authService.authenticate(this.token(authorization));
    return this.assignmentsService.remove(user, id);
  }

  @Post(':id/submit')
  async submit(@Headers('authorization') authorization: string | undefined, @Param('id') id: string, @Body() body: unknown) {
    const { user } = await this.authService.authenticate(this.token(authorization));
    return this.assignmentsService.submit(user, id, body);
  }

  @Post(':id/dismiss-alert')
  async dismissAlert(@Headers('authorization') authorization: string | undefined, @Param('id') id: string) {
    const { user } = await this.authService.authenticate(this.token(authorization));
    return this.assignmentsService.dismissAlert(user, id);
  }

  @Get(':id/submissions')
  async submissions(@Headers('authorization') authorization: string | undefined, @Param('id') id: string) {
    const { user } = await this.authService.authenticate(this.token(authorization));
    return this.assignmentsService.listSubmissions(user, id);
  }

  @Patch(':id/submissions/:submissionId/grade')
  async grade(
    @Headers('authorization') authorization: string | undefined,
    @Param('id') id: string,
    @Param('submissionId') submissionId: string,
    @Body() body: unknown,
  ) {
    const { user } = await this.authService.authenticate(this.token(authorization));
    return this.assignmentsService.grade(user, id, submissionId, body);
  }

  private token(authorization?: string) {
    return authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : undefined;
  }
}
