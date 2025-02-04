import { createContext, useState } from "react";
import run from "../config/gemini";


export const Context = createContext();

const ContextProvider=(props)=>{

  const [input , setInput] =useState("")
  const[recentPrompt, setRecentPrompt] = useState("");
  const[prevPrompts, setPrevPrompts] = useState([]);
  const[showResult, setShowResult] = useState(false);
  const[loading, setLoading] = useState(false);
  const[resultData, setResultData] = useState("");
  // typing effect by delay
  const delayPara =(index , nextWord)=>{
    setTimeout(() => {
      setResultData(prev=>prev+nextWord)
    }, 75*index);

  }

  const newChat   =()=>{
    setLoading(false)
    setShowResult(false)
  }

  const onSent = async (prompt)=>{
    setResultData("")
    setLoading(true)
    setShowResult(true)
    let result;
    if (prompt !== undefined) {
      
      result = await run(prompt);
      setRecentPrompt(prompt)
    }
    else{
      setPrevPrompts(prev => [...prev,input])
      setRecentPrompt(input)
       result = await run(input)
    }
    // setRecentPrompt(input)
    // setPrevPrompts(prev => [...prev,input])
    //  const result = await run(input)
    //  removing ****
     let resArray = result.split("**");
     let newRes= "";
     for(let i=0; i< resArray.length;i++)
     {
        if (i === 0 ||i%2 !== 1) {
          newRes += resArray[i];
          
        }
        else{
          newRes += "<b>" + resArray[i] +"</b>";
        }
     }
     let newRes2 = newRes.split("*").join("</br>")
    //  setResultData(newRes2)
    let newResArray = newRes2.split(" ");
    for(let i=0;i<newResArray.length;i++){
      const nextWord = newResArray[i];
      delayPara(i, nextWord + " ")
    }
     setLoading(false)
     setInput("")
  }

  // onSent("what is react.js ?")


  const contextValue= {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    newChat
 
  }

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    
    </Context.Provider>
  )

}
export default ContextProvider