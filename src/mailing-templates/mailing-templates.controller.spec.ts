import { Test, TestingModule } from '@nestjs/testing';
import { MailingTemplatesController } from './mailing-templates.controller';

describe('MailingTemplates Controller', () => {
  let controller: MailingTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailingTemplatesController],
    }).compile();

    controller = module.get<MailingTemplatesController>(MailingTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
