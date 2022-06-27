import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "./Usuario";


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
    estoqueTotal?: number;

    @Column(({nullable:false,default: 0}))
    estoque?: number;

    @Column(({nullable:false,default:0.0,type:"float"}))
    preco?: number;
    
    @Column(({nullable:false, default: 0}))
    fornecedorId?: number;

    @ManyToOne(() => UsuarioEntity,(usuario)=> usuario.Id)
    usuario!: UsuarioEntity | null;



    // marcaId



    // categoriaId

}