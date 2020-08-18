import { Test, TestingModule } from '@nestjs/testing';
import { MailingTemplatesService } from './mailing-templates.service';

describe('MailingTemplatesService', () => {
  let service: MailingTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailingTemplatesService],
    }).compile();

    service = module.get<MailingTemplatesService>(MailingTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
