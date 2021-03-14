import { useRouter } from 'next/router'
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/types/documents';
import Link from 'next/link';
import PrismicDOM from 'prismic-dom';   
import { GetStaticPaths, GetStaticProps } from 'next';
import { client } from '@/lib/prismic';


interface ProductProps {

  product: Document;
}

//loading de componentes dinamicos, ssr false so renderiza o componente do lado do browser, e n do servidor
// const AddToCartModal = dynamic(
//   () => import('@/components/AddToCartModal'),
//   {loading: () => <p>Loading...</p>, ssr: false}
// )


export default function Product({ product }: ProductProps) {
    const router = useRouter();
    
    
    if(router.isFallback) {
      return <p>Carregando...</p>
    }

    // const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false)


    // function handleAddToCart() {
    //   setIsAddToCartModalVisible(true);
    // }

    
  
  return (
      <div>
        <h1>{PrismicDOM.RichText.asText(product.data.title)}</h1>

        <img src={product.data.thumbnail.url} width="600" alt="" />

        {/* <button onClick={handleAddToCart}>add to cart</button> */}
        {/* {PrismicDOM.RichText.asHtml(product.data.description)} */}
        
        <div dangerouslySetInnerHTML={{__html: PrismicDOM.RichText.asHtml(product.data.description) }}>

        </div>
        <p>Price: ${product.data.price}</p>
        {/* { isAddToCartModalVisible && <AddToCartModal />} */}
      </div>
    )
}



//puxa todos os caminhos q temos com base no backend
export const getStaticPaths: GetStaticPaths = async () => {
    
  


  return {
      paths: [],
      //com o fallback true, apos o yarn build, se criarmos mais dados no back e n for gerada a rota dinamica, ele realiza a geracao pra nos sem o yarn build
      fallback: true,
  }
}


// o getstaticprops usamos para paginas q n sofrem mudanca em seus dados no banco de dados (ex: post de blog),
// ela sera gerada de gorma estatica para ganharmos performance no carregamento do front end
export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = context.params;  

  
  //chamada prismic
  const product = await client().getByUID('product', String(slug) , {});
 
  console.log(`product: `, product);
 
  //chamada fetch cliente normal
  // const response = await fetch(`http://localhost:3333/products?category_id=${slug}`);
  // const products = await response.json();
  
  return {
      props: {
          product,
      },  
      //com o revalidate, a cada 5 segundos, o next precisa gerar uma atualizacao dessa pagina pra mim
      revalidate: 5,
  }
}
  