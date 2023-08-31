import { Column, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('MeliStaging')
export class MeliModel {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  // @Column()
  // condition:string

  // @Column()
  // thumbnail_id:string

  // @Column()
  // catalog_product_id:any

  // @Column()
  // listing_type_id:string

  // @Column()
  // permalink:string

  // @Column()
  // buying_mode:string

  // @Column()
  // site_id:string

  // @Column()
  // category_id:string

  // @Column()
  // domain_id:string

  // @Column()
  // thumbnail:string

  // @Column()
  // currency_id:string

  // @Column()
  // order_backend:number

  // @Column()
  // price: number;

  // @Column()
  // original_price:number

  // @Column()
  // sale_price:number

  // @Column()
  // sold_quantity:number

  // @Column()
  // available_quantity:number

  // @Column()
  // official_store_id:number

  // @Column()
  // use_thumbnail_id:boolean

  // @Column()
  // accepts_mercadopago:boolean

  // @Column()
  // tags:[]

  // @Column()
  // shipping:{}

  // @Column()
  // stop_time:string

  // @Column()
  // seller:{}

  // @Column()
  // seller_address:{}

  // @Column()
  // address:{}

  // @Column()
  // attributes:[]

  // @Column()
  // location:{}

  // @Column()
  // seller_contact:{}

  // @Column()
  // installments:any

  // @Column()
  // winner_item_id:number

  // @Column()
  // catalog_listing:boolean

  // @Column()
  // discounts:any

  // @Column()
  // promotions:[]

  // @Column()
  // inventory_id:number

  @UpdateDateColumn()
  last_update: Date;
}
