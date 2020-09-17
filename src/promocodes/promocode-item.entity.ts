import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Item } from 'src/items/item.entity';
import { Promocode } from './promocode.entity';


@Entity()
export class PromocodeItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  promocodeId: number;

  @Column('int')
  itemId: number;

  @Column({ type: 'int', default: 1 })
  amount: number;

  @ManyToOne(type => Promocode, promo => promo.promocode_items, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  promocode: Promocode;

  @ManyToOne(type => Item, item => item.promocode_items, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  item: Item;
}