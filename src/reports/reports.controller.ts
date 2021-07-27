import { 
    Controller, 
    Post, 
    Body, 
    UseGuards, 
    Patch,
    Param,
    Get,
    Query 
} from '@nestjs/common';
import { AuthGuard } from 'src/Guards/auth.guard';
import { createReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { User } from 'src/users/users.entity';
import { ReportDto } from './dtos/reports.dto';
import { Serialize } from '../interceptors/serialize.interceptor'
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGurad } from 'src/Guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';
@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService) {}

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: createReportDto, @CurrentUser() user: User) {
        return this.reportService.create(body, user)
    }

    @Patch('/:id')
    @UseGuards(AdminGurad)
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
        return this.reportService.changeApproval(id, body.approved)
    }

    @Get()
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportService.createEstimate(query)
    }
    
}
