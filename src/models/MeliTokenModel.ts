import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('MeliToken')
export class MeliTokenModel{

    @PrimaryColumn()
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