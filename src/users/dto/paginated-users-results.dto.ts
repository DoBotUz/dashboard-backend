import { User } from "../user.entity";

export class PaginatedUsersResultDto {
  data: User[]
  page: number
  limit: number
  totalCount: number
}