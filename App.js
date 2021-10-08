import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Keyboard} from 'react-native';

import Picker from './src/components/Picker';
import api from './src/services/api';

export default function App() {
  const [moedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [moedaBValor, setMoedaBValor] = useState(0);

  const [valorMoeda, setValorMoeda] = useState(null);
  const [valorConvertido, setValorConvertido] = useState(0);

  useEffect(()=>{
    async function loadMoedas(){
      const response = await api.get('all');
      
      let arrayMoedas = []
      Object.keys(response.data).map((key)=>{ //Object.keys = para que transforme o meu objeto como array
        arrayMoedas.push({
          key: key,
          label: key,
          value: key
        })
      })
      
      setMoedas(arrayMoedas);
      setLoading(false);


    }

    loadMoedas();
  }, []);


  async function converter(){
    if(moedaSelecionada === null || moedaBValor === 0){
      alert('Por favor selecione uma moeda.');
      return;
    }
    
    //USD-BRL ele devolve quanto é 1 dolar convertido pra reais
    const response = await api.get(`all/${moedaSelecionada}-BRL`);
    //console.log(response.data[moedaSelecionada].ask);

    let resultado = (response.data[moedaSelecionada].ask * parseFloat(moedaBValor) ); //vamos fazer uma multiplicação, a moeda x o número que queremos dessa conversão
    setValorConvertido(`R$ ${resultado.toFixed(2)}`);
    setValorMoeda(moedaBValor)

    //Aqui ele fecha o teclado
    Keyboard.dismiss();


  }
 
  if(loading){
   return(
   <View style={{ justifyContent: 'center', alignItems: 'center', flex:1 }}>
    <ActivityIndicator color="#FFF" size={45} />
   </View>
   )
 }else{
  return (
    <View style={styles.container}>
      <Text style={styles.titleContent}>Converter Moeda</Text>
      <View style={styles.areaMoeda}>
        <View>
        <Text style={styles.titulo}>Selecione sua moeda</Text>
        <Picker moedas={moedas} onChange={ (moeda) => setMoedaSelecionada(moeda) } />
        </View>
  
        <View style={styles.areaValor}>
        <Text style={styles.titulo}>Digite um valor para converter em (R$)</Text>
        <TextInput
        placeholder="EX: 150"
        style={styles.input}
        placeholderTextColor="#989aa1"
        keyboardType="numeric"
        onChangeText={ (valor) => setMoedaBValor(valor) }
        />
        </View>
      </View>
     <TouchableOpacity style={styles.botaoArea} onPress={converter}>
       <Text style={styles.botaoTexto}>Converter</Text>
     </TouchableOpacity>
 
      {valorConvertido !== 0 && (
      <View style={styles.areaResultado}>
        <Text style={styles.valorConvertido}>
            {valorMoeda} {moedaSelecionada}
        </Text>
        <Text style={[styles.valorConvertido, { fontSize: 18, margin: 10 } ]}>
          Corresponde a
        </Text>
        <Text style={styles.valorConvertido}>
          {valorConvertido}
        </Text>
      </View>
      )}
 
    </View>
   );
 }

}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems: 'center',
    backgroundColor: '#13151b',
    paddingTop: 50
  },
  titleContent:{
    color:'#F9F9F9',
    fontSize:20,
    marginBottom:15
  },
  areaMoeda:{
    width: '90%',
    backgroundColor: '#1c1f2a',
    padding: 15,
    borderRadius: 9,
    marginBottom: 1,
    borderWidth:1,
    borderColor:'#12131a',
    elevation:1
  },
  titulo:{
    fontSize: 15,
    color: '#fff',
    paddingTop: 5,
    paddingLeft: 5,
  },
  areaValor:{
    width: '90%',
    backgroundColor: '#1c1f2a',
    paddingBottom: 9,
    paddingTop: 9
  },
  input:{
    width: '100%',
    padding: 10,
    height: 45,
    fontSize: 20,
    marginTop: 8,
    color: '#fff',
    borderBottomWidth:1,
    borderBottomColor:'#2b2f3d',
  },
  botaoArea:{
   width: '30%',
   backgroundColor: '#181b33',
   height: 45 ,
   borderRadius: 9,
   justifyContent: 'center',
   alignItems: 'center',
   borderWidth:1,
   borderColor:'#1e2143',
   marginTop:30
  },
  botaoTexto:{
    fontSize: 18,
    color:'#FFF',
  },
  areaResultado:{
    width: '90%',
    backgroundColor:'#1c1f2a',
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    borderRadius:9,
    borderWidth:1,
    borderColor:'#12131a',
    elevation:1
  },
  valorConvertido:{
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  }
});  