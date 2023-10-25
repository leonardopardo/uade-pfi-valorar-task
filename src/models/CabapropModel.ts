import { Entity, ObjectIdColumn, ObjectId, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('CabapropStaging')
export class CabapropModel {
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
