import { Dispatch, SetStateAction, useCallback, useState, ChangeEvent } from 'react';


const useInput = <T=any>(T:any) : [T, (e:any) => void, Dispatch<SetStateAction<T>>] => {
  
    const [value, setValue] = useState(T);
    const handler = useCallback((e: any) => {
    setValue(e.currentTarget.value);
    }, []);

    return [value, handler, setValue];

};

export default useInput;