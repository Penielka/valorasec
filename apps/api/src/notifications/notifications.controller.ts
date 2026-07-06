import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';

interface JwtRequest extends Request {
  user: { sub: string };
}

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  async findAll(@Req() req: JwtRequest) {
    return this.notificationsService.findAll(req.user.sub);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markRead(@Req() req: JwtRequest, @Param('id') id: string) {
    await this.notificationsService.markRead(req.user.sub, id);
    return { data: { message: 'Notification marked as read' } };
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllRead(@Req() req: JwtRequest) {
    await this.notificationsService.markAllRead(req.user.sub);
    return { data: { message: 'All notifications marked as read' } };
  }
}
