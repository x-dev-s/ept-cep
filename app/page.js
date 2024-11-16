'use client';
import { IoInformation } from 'react-icons/io5';
import { RiFormula } from "react-icons/ri";
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [showSelfDistanceInfo, setShowSelfDistanceInfo] = useState(false);
  const [showSelfDistanceFormula, setShowSelfDistanceFormula] = useState(false);
  const [showDistanceBetweenPhasesInfo, setShowDistanceBetweenPhasesInfo] = useState(false);
  const [showDistanceBetweenPhasesFormula, setShowDistanceBetweenPhasesFormula] = useState(false);
  const [showSurfaceFactorInfo, setShowSurfaceFactorInfo] = useState(false);
  const [showMaxDcvGradientInfo, setShowMaxDcvGradientInfo] = useState(false);
  const [showPhaseSpacingInfo, setShowPhaseSpacingInfo] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    console.log(data);
    setLoading(false);
  }

  return (
    <div className="flex flex-col justify-center gap-10">
      <h1 className="text-4xl font-extrabold font-mono text-center">TRANSMISSION SYSTEM ANALYSIS</h1>
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <p className="font-mono">Enter the following parameters to get started:</p>

        <p className="text-2xl font-bold underline underline-offset-4">System Parameters</p>
        <div className='flex flex-wrap gap-5'>
          <div className="p-2 border-b-2 border-white flex items-center gap-2 basis-64 flex-1">
            <input required type="number" name="voltage" placeholder="Voltage (kV)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
          </div>

          <div className="p-2 border-b-2 border-white flex items-center gap-2 basis-64 flex-1">
            <input required type="number" name="frequency" placeholder="Frequency (Hz)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
          </div>

          <div className="p-2 border-b-2 border-white flex items-center gap-2 basis-64 flex-1">
            <input required type="number" name="power" placeholder="Power (MVA)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
          </div>

          <div className="p-2 border-b-2 border-white flex items-center gap-2 basis-64 flex-1">
            <input required type="number" name="power_factor" placeholder="Power Factor" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
          </div>
        </div>

        <p className="text-2xl font-bold underline underline-offset-4">For Inductance & Capacitance</p>
        <div className="flex flex-wrap gap-5">
          <div className="p-2 border-b-2 border-white flex items-center gap-2 basis-64 flex-1">
            <input required type="number" min={0} step={0.0001} name="diameter" placeholder="Diameter (m)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
          </div>

          <div className="p-2 border-b-2 border-white flex items-center gap-2 basis-64 flex-1">
            <input required type="number" name="bundle_spacing" placeholder="Bundle Spacing (m)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
          </div>

          <div className="p-2 border-b-2 border-white flex items-center gap-2 basis-64 flex-1">
            <input required type="text" pattern="^[0-9,]*$" name="self_distance" placeholder="Self Distance &quot;Ds&quot; of all phases (m)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" onInput={(e) => e.target.setCustomValidity(e.target.validity.patternMismatch ? "Please enter a comma separated list of numbers" : "")} />
            <span onMouseOver={() => setShowSelfDistanceInfo(true)} onMouseOut={() => setShowSelfDistanceInfo(false)} className="cursor-pointer relative">
              {
                showSelfDistanceInfo &&
                <div className="absolute -top-24 right-0 bg-gray-100 text-black p-2 rounded-lg shadow-lg w-[250px]">
                  <p>Seperate the self distance of all phases &quot;A-A&apos;, B-B&apos;, C-C&apos;&quot; by a comma &quot;,&quot; for each phase. </p>
                </div>
              }
              <IoInformation size={18} className="text-gray-600 bg-white rounded-full flex items-center justify-center p-[2px]" />
            </span>
            <span onMouseOver={() => setShowSelfDistanceFormula(true)} onMouseOut={() => setShowSelfDistanceFormula(false)} className="cursor-pointer relative">
              {
                showSelfDistanceFormula &&
                <div className="absolute -top-20 right-0 bg-gray-100 text-black p-2 rounded-lg shadow-lg w-[250px] flex items-center justify-center">
                  <Image src="/images/self_distance.jpg" width={200} height={100} alt="Self Distance Formula" className='object-contain mix-blend-darken' />
                </div>
              }
              <RiFormula size={18} className="text-gray-600 bg-white rounded-full flex items-center justify-center p-[2px]" />
            </span>
          </div>

          <div className="p-2 border-b-2 border-white flex items-center gap-2 basis-64 flex-1">
            <input required type="text" pattern="^[0-9,]*$" name="Distance between Phases" placeholder="Distance between Phases (m)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" onInput={(e) => e.target.setCustomValidity(e.target.validity.patternMismatch ? "Please enter a comma separated list of numbers" : "")} />
            <span onMouseOver={() => setShowDistanceBetweenPhasesInfo(true)} onMouseOut={() => setShowDistanceBetweenPhasesInfo(false)} className="cursor-pointer relative">
              {
                showDistanceBetweenPhasesInfo &&
                <div className="absolute -top-20 right-0 bg-gray-100 text-black p-2 rounded-lg shadow-lg w-[250px]">
                  <p>Seperate the distance between phases &quot;AB, BC, CA&quot; by a comma &quot;,&quot;. </p>
                </div>
              }
              <IoInformation size={18} className="text-gray-600 bg-white rounded-full flex items-center justify-center p-[2px]" />
            </span>
            <span onMouseOver={() => setShowDistanceBetweenPhasesFormula(true)} onMouseOut={() => setShowDistanceBetweenPhasesFormula(false)} className="cursor-pointer relative">
              {
                showDistanceBetweenPhasesFormula &&
                <div className="absolute -top-20 right-0 bg-gray-100 text-black p-2 rounded-lg shadow-lg w-[250px] flex items-center justify-center">
                  <Image src="/images/distance_between_phases.jpg" width={200} height={120} alt="Distance between Phases Formula" className='object-contain mix-blend-darken' />
                </div>
              }
              <RiFormula size={18} className="text-gray-600 bg-white rounded-full flex items-center justify-center p-[2px]" />
            </span>
          </div>
        </div>

        <p className="text-2xl font-bold underline underline-offset-4">For Corona Loss</p>
        <div className="flex flex-wrap gap-5">
          <div className="p-2 border-b-2 border-white flex items-center gap-2 basis-64 flex-1">
            <input required type="number" name="pressure" placeholder="Pressure (mm of Hg)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
          </div>

          <div className="p-2 border-b-2 border-white flex items-center gap-2 basis-64 flex-1">
            <input required type="number" name="temperature" placeholder="Temperature (°C)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
          </div>

          <div className="p-2 border-b-2 border-white flex items-center gap-2 basis-64 flex-1">
            <input required type="number" name="surface_factor" placeholder="Surface Factor" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
            <span onMouseOver={() => setShowSurfaceFactorInfo(true)} onMouseOut={() => setShowSurfaceFactorInfo(false)} className="cursor-pointer relative">
              {
                showSurfaceFactorInfo &&
                <div className="absolute -top-28 right-0 bg-gray-100 text-black p-2 rounded-lg shadow-lg w-[250px]">
                  <p>Surface factor or irregularity factor or roughness factor is the ratio of the actual surface area to the projected surface area.</p>
                </div>
              }
              <IoInformation size={18} className="text-gray-600 bg-white rounded-full flex items-center justify-center p-[2px]" />
            </span>
          </div>

          <div className="p-2 border-b-2 border-white flex items-center gap-2 basis-64 flex-1">
            <select required name="max_dcv_gradient" placeholder="Max. dCv/dz Gradient (V/m)" className="border-none placeholder:text-gray-300 bg-black focus:outline-none bg-transparent flex-1 cursor-pointer">
              <option value={(3e6 / Math.sqrt(2)).toExponential(2)}>{(3e6 / Math.sqrt(2)).toExponential(2)} at 25°C</option>
              <option value={(2.99e6 / Math.sqrt(2)).toExponential(2)}>{(2.99e6 / Math.sqrt(2)).toExponential(2)} at 26°C</option>
              <option value={(2.98e6 / Math.sqrt(2)).toExponential(2)}>{(2.98e6 / Math.sqrt(2)).toExponential(2)} at 27°C</option>
              <option value={(2.97e6 / Math.sqrt(2)).toExponential(2)}>{(2.97e6 / Math.sqrt(2)).toExponential(2)} at 28°C</option>
              <option value={(2.96e6 / Math.sqrt(2)).toExponential(2)}>{(2.96e6 / Math.sqrt(2)).toExponential(2)} at 29°C</option>
              <option value={(2.95e6 / Math.sqrt(2)).toExponential(2)}>{(2.95e6 / Math.sqrt(2)).toExponential(2)} at 30°C</option>
              <option value={(2.94e6 / Math.sqrt(2)).toExponential(2)}>{(2.94e6 / Math.sqrt(2)).toExponential(2)} at 31°C</option>
              <option value={(2.93e6 / Math.sqrt(2)).toExponential(2)}>{(2.93e6 / Math.sqrt(2)).toExponential(2)} at 32°C</option>
              <option value={(2.92e6 / Math.sqrt(2)).toExponential(2)}>{(2.92e6 / Math.sqrt(2)).toExponential(2)} at 33°C</option>
              <option value={(2.91e6 / Math.sqrt(2)).toExponential(2)}>{(2.91e6 / Math.sqrt(2)).toExponential(2)} at 34°C</option>
              <option value={(2.90e6 / Math.sqrt(2)).toExponential(2)}>{(2.90e6 / Math.sqrt(2)).toExponential(2)} at 35°C</option>
              <option value={(2.89e6 / Math.sqrt(2)).toExponential(2)}>{(2.89e6 / Math.sqrt(2)).toExponential(2)} at 36°C</option>
              <option value={(2.88e6 / Math.sqrt(2)).toExponential(2)}>{(2.88e6 / Math.sqrt(2)).toExponential(2)} at 37°C</option>
            </select>
            <span onMouseOver={() => setShowMaxDcvGradientInfo(true)} onMouseOut={() => setShowMaxDcvGradientInfo(false)} className="cursor-pointer relative">
              {
                showMaxDcvGradientInfo &&
                <div className="absolute -top-20 right-0 bg-gray-100 text-black p-2 rounded-lg shadow-lg w-[250px]">
                  <p>Maximum Disruptive Critical Voltage Gradient or Air density factor.</p>
                </div>
              }
              <IoInformation size={18} className="text-gray-600 bg-white rounded-full flex items-center justify-center p-[2px]" />
            </span>
          </div>

          <div className="p-2 border-b-2 border-white flex items-center gap-2 basis-64 flex-1">
            <input required type="number" name="cross_arm_distance" placeholder="Cross Arm Distance (m)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
          </div>

          <div className="p-2 border-b-2 border-white flex items-center gap-2 basis-64 flex-1">
            <input required type="text" pattern="^[0-9,]*$" name="phase_spacing" placeholder="Phase Spacing (m)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
            <span onMouseOver={() => setShowPhaseSpacingInfo(true)} onMouseOut={() => setShowPhaseSpacingInfo(false)} className="cursor-pointer relative" onInput={(e) => e.target.setCustomValidity(e.target.validity.patternMismatch ? "Please enter a comma separated list of numbers" : "")}>
              {
                showPhaseSpacingInfo &&
                <div className="absolute -top-24 right-0 bg-gray-100 text-black p-2 rounded-lg shadow-lg w-[250px]">
                  <p>Seperate phase spacing by a comma &quot;,&quot; for all phases, if unsymmetric, in the sequence of &quot;A-B, B-C, C-A&quot;</p>
                </div>
              }
              <IoInformation size={18} className="text-gray-600 bg-white rounded-full flex items-center justify-center p-[2px]" />
            </span>
          </div>
        </div>
        <button type="submit" disabled={loading ? true : false} className="border border-white text-white p-2 rounded-2xl flex items-center justify-center text-center w-full max-w-80 mx-auto">{loading ? <div className="w-5 h-5 border-t-2 border-b-2 border-gray-100 rounded-full animate-spin"></div> : "Calculate"}</button>
      </form>
      {error && <p className="text-red-300 text-xs text-center">{error}</p>}
    </div >
  );
}
