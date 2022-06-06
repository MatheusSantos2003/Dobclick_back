import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "Cliente" })
export class ClienteEntity {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column({ nullable: false })
    nome?: string;

    @Column({nullable:true})
    telefone?: string

    @Column({nullable:true})
    email?: string

    
}
