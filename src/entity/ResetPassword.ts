import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "ResetPassword" })
export class ResetPasswordEntity {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column({ nullable: false })
    token?: string;

    @Column({ nullable: false })
    userEmail?: string;

    @Column({ nullable: false })
    userId?: number;

}
