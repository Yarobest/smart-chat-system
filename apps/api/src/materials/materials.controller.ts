import { Body,Controller,Delete,Get,Headers,Param,Patch,Post } from '@nestjs/common';
import { ApiBearerAuth,ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { MaterialsService } from './materials.service';
@ApiTags('Course Materials') @ApiBearerAuth() @Controller('materials')
export class MaterialsController { constructor(private auth:AuthService,private materials:MaterialsService){} private async user(a?:string){return(await this.auth.authenticate(a?.startsWith('Bearer ')?a.slice(7).trim():undefined)).user}
@Get() list(@Headers('authorization')a?:string){return this.user(a).then(u=>this.materials.list(u))}
@Get('course-offerings') offerings(@Headers('authorization')a?:string){return this.user(a).then(u=>this.materials.offerings(u))}
@Post() create(@Headers('authorization')a:string|undefined,@Body()b:unknown){return this.user(a).then(u=>this.materials.create(u,b))}
@Get(':id') detail(@Headers('authorization')a:string|undefined,@Param('id')id:string){return this.user(a).then(u=>this.materials.detail(u,id))}
@Patch(':id') update(@Headers('authorization')a:string|undefined,@Param('id')id:string,@Body()b:unknown){return this.user(a).then(u=>this.materials.update(u,id,b))}
@Delete(':id') remove(@Headers('authorization')a:string|undefined,@Param('id')id:string){return this.user(a).then(u=>this.materials.remove(u,id))}
@Post(':id/open') open(@Headers('authorization')a:string|undefined,@Param('id')id:string){return this.user(a).then(u=>this.materials.open(u,id))}
@Post(':id/dismiss-alert') dismiss(@Headers('authorization')a:string|undefined,@Param('id')id:string){return this.user(a).then(u=>this.materials.dismiss(u,id))}
}
