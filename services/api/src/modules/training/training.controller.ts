import { Body, Controller, Post } from '@nestjs/common';
import { CONTROLLER } from 'enum/controller.enum';
import { PostTrainingDto } from './dto/post-training.dto';
import { TrainingService } from './training.service';

@Controller(CONTROLLER.TRAINING)
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}
  @Post()
  async post(@Body() body: PostTrainingDto) {
    const data = await this.trainingService.post(body);
    return {
      data,
      message: 'Training Unit successfully',
    };
  }
}
