type Phases = "idle" | 'searching' | 'pokemon_shown' | 'catching' | 'finished'

const Catching = ({animation, setPhase}: {animation:string, setPhase: (phase:Phases)=> void}) => {
  return (
    <>
        <div className='flex justify-center items-center h-[100%]'>
            <video
                src={animation}
                autoPlay
                muted
                playsInline
                
                onEnded={() => setPhase('finished')}
                className=" w-100 h-100 object-contain"
                />
        </div>
    </>
  )
}

export default Catching