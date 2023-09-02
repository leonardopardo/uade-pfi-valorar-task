import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'MeliToken'})
export class MeliTokenModel{

    @ObjectIdColumn()
    uuid: ObjectID;

    @Column()
    user_id:number

    @Column()
    access_token:string 
    
    @Column()
    token_type:string 
    
    @Column()
    expires_in:number
    
    @Column()
    scope:string
        
    @Column()
    refresh_token:string
}