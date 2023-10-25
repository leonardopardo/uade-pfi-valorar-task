import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity({name: 'MeliToken'})
export class MeliTokenModel{

    @ObjectIdColumn()
    uuid: ObjectId;

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