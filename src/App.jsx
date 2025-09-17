import TimePicker from "./components/time-picker/TimePicker";

export default function App() {

       return (
              <>
                     <section className='w-full max-w-[40rem] h-82 flex flex-col justify-center items-center mx-auto'>
                            <TimePicker
                                   callback={(e) => { console.log(e) }}
                            />
                     </section>
              </>
       )
}
