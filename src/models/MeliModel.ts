import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn, UpdateDateColumn } from "typeorm";

@Entity('MeliStaging')
export class MeliModel {
  @ObjectIdColumn()
  uuid: ObjectId;

  @Column({ unique: true })
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
