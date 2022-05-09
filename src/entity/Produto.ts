import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: "Produto" })
export class ProdutoEntity {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column({nullable: true})
    codigo?: string;

    @Column({ nullable: false })
    descricao?: string;
    
    @Column({nullable: false})
    tamanho?: string;

    @Column({ nullable: false})
    genero?: string;

    @Column({nullable :false, default:"Sem Marca" })
    marca?: string;

    @Column({nullable: false})
    cor?: string;

    @Column(({nullable:false,default: 0}))
    estoque?: number;

    @Column(({nullable:false, default: 0}))
    fornecedorId?: number;


    // marcaId

    // usuarioId

    // categoriaId

}