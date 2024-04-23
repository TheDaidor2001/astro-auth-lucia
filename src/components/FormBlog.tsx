import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


export const FormBlog = () => {

    const [value, setValue] = useState('');
    const [data, setData] = useState({
        title: "",
        subtitle: "",
        content: value,
        date: ""
    })
    const [isDataReady, setIsDataReady] = useState(false);



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Actualiza el estado 'data' con el contenido del formulario
        setData({ ...data, content: value });
        setIsDataReady(true); // Indica que los datos están listos para ser enviados a la API
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!isDataReady) return; // Evita realizar la solicitud si los datos no están listos
                // Espera a que se actualice el estado 'data'
                console.log(data); // Verifica que 'data' se haya actualizado correctamente

                const res = await fetch('/api/createNoticia', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                const news = await res.json();
                console.log(news);
                setIsDataReady(false); // Restablece el estado isDataReady
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [isDataReady]); // Ejecutar cuando 'isDataReady' cambie


    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white w-full mx-auto max-w-7xl mt-10 px-5 rounded-2xl py-5">
                <div className="">
                    <label htmlFor="title">Título</label>
                    <input className="border border-gray-500 w-full" type="text" id="title" name="title" value={data.title} onChange={e => setData({ ...data, [e.target.name]: e.target.value })} />
                </div>
                <div className="">
                    <label htmlFor="subtitle">Subtitulo</label>
                    <input className="border border-gray-500 w-full" type="text" id="subtitle" name="subtitle" value={data.subtitle} onChange={e => setData({ ...data, [e.target.name]: e.target.value })} />
                </div>
                <div className="">
                    <ReactQuill theme="snow" value={value} onChange={setValue} />
                </div>
                <div className="">
                    <label htmlFor="date">Fecha</label>
                    <input className="border border-gray-500 w-full" type="date" id="date" name="date" value={data.date} onChange={e => setData({ ...data, [e.target.name]: e.target.value })} />
                </div>
                <button className="bg-blue-300 w-full mt-5 py-1 rounded-md text-white font-bold">Enviar</button>
            </form>
        </>
    )
}
