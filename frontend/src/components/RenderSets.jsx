

const RenderSets = ({ sets, handleDeleteSet, handleWeightChange, handleRepsChange}) => {

    return sets.map((set, index) => (
        <div key={set.id} className="flex flex-wrap items-center gap-2 mb-5">
            <label htmlFor="sets" className="mr-1">Set</label>
            <button name="sets" className="w-5 rounded-md bg-white font-bold p-0 mr-3">{index + 1}</button>

            <label htmlFor="reps" className="mr-1"> Reps </label>
            <input type="text"
                name="reps"
                className="w-10 rounded-md mr-3 pl-1"
                value={set.exercise_reps}
                onChange={(e) => handleRepsChange(e, set.id)}
            />

            <label htmlFor="weight" className="mr-1"> Weight </label>
            <input type="text"
                name="weight"
                className="w-10 rounded-md pl-1"
                value={set.exercise_weight}
                onChange={(e) => handleWeightChange(e, set.id)}
            />
    
            <button className="submit delete ml-auto hover:bg-blue-600" onClick={() => handleDeleteSet(set.id)}>
                <img src="../images/trash.webp" alt="trash" />
            </button>
        </div>
    ));
}

export default RenderSets;