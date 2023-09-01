import { Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn, UpdateDateColumn } from "typeorm";

@Entity('MeliStaging')
export class MeliModel {
  @ObjectIdColumn()
  uuid: ObjectID;

  @Column({ unique: true })
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
