import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('CabapropStaging')
export class CabapropModel {
  @ObjectIdColumn()
  uuid: ObjectId;

  @Column({ unique: true })
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
