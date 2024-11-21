'use client';
import { IoInformation } from 'react-icons/io5';
import { RiFormula } from "react-icons/ri";
import { useState } from 'react';
import Image from 'next/image';
import { ResistanceData } from './resistanceData';
import {
  abs,
  arg,
  complex,
  cos,
  pow,
  round,
  multiply,
  divide,
  add,
  isArray,
  cbrt
} from 'mathjs';


const AreAllElementsSame = (arr) => arr.every((val, i, arr) => val === arr[0]);

Array.prototype.removeEmpty = function () {
  return this.filter(function (el) {
    return el != null && el != "";
  });
};

export default function SingleCircuit() {
  const [isInductanceProvided, setIsInductanceProvided] = useState(false);
  const [isCapacitanceProvided, setIsCapacitanceProvided] = useState(false);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError("");
      setLoading(true);
      const form = e.target;
      const formData = new FormData(form);
      const data = {};
      for (let [key, value] of formData.entries()) {
        value = value.replace(/ /g, "");
        data[key] = value.includes(",") ? value.split(',').map(v => parseFloat(v)).removeEmpty() : parseFloat(value);
      }
      console.log(data);
      const r = data.diameter / 2;
      const r_dash = r * 0.7788;
      console.log("Radius: ", r, "Radius Dash: ", r_dash);
      let ds = null;
      let dm = null;
      let Xl = isInductanceProvided ? data.inductive_reactance * data.line_length : null;
      let Xc = isCapacitanceProvided ? data.capacitive_reactance * data.line_length : null;
      if (!isInductanceProvided || !isCapacitanceProvided) {
        let dsb = null;
        if (data.number_of_bundled_conductors === 2) { dsb = Math.sqrt(r_dash * data.bundle_spacing); }
        else if (data.number_of_bundled_conductors === 3) { dsb = Math.cbrt(r_dash * pow(data.bundle_spacing, 2)); }
        else { dsb = 1.09 * Math.pow(r_dash * pow(data.bundle_spacing, 3), 0.25); }
        console.log("dsb: ", dsb);
        let ds1 = pow(pow(dsb, 2) + pow(data.self_distance[0], 2), 0.25);
        let ds2 = pow(pow(dsb, 2) + pow(data.self_distance[1], 2), 0.25);
        let ds3 = pow(pow(dsb, 2) + pow(data.self_distance[2], 2), 0.25);

        ds = cbrt(ds1 * ds2 * ds3);

        if (!Array.isArray(data.distance_between_phases) || AreAllElementsSame(data.distance_between_phases)) {
          dm = !Array.isArray(data.distance_between_phases) ? data.distance_between_phases : data.distance_between_phases[0];
          console.log("symmetric: ", dm);
        } else {
          console.log(data.distance_between_phases.reduce((a, b) => a * b));
          dm = Math.cbrt(data.distance_between_phases.reduce((a, b) => a * b));
        }
        console.log("dm: ", dm);
        if (!isInductanceProvided) {
          let L = 2e-7 * Math.log(dm / ds) * 1e3;
          Xl = 2 * Math.PI * data.frequency * L * data.line_length;
        }
        console.log("Xl: ", Xl);
        if (data.number_of_bundled_conductors === 2) { ds = Math.sqrt(r * data.bundle_spacing); }
        else if (data.number_of_bundled_conductors === 3) { ds = Math.cbrt(r * pow(data.bundle_spacing, 2)); }
        else { ds = 1.09 * Math.pow(r * pow(data.bundle_spacing, 3), 0.25); }
        console.log("ds_new: ", ds);
        if (!isCapacitanceProvided) {
          let C = (5.56e-11 / Math.log(dm / ds)) * 1e3;
          Xc = 1 / (2 * Math.PI * data.frequency * C * data.line_length);
        }
        console.log("Xc: ", Xc);
      }
      let density_factor = 0.392 * data.pressure / (273 + data.temperature);
      console.log("Density Factor: ", density_factor);
      const dcv_gradient = 2.12e6;
      const phase_voltage = data.voltage / Math.sqrt(3)
      // const D = isNaN(data.cross_arm_distance) ? isArray(data.phase_spacing) ? Math.cbrt(data.phase_spacing.reduce((a, b) => a * b)) : data.phase_spacing : !isArray(data.phase_spacing) ? Math.pow(data.cross_arm_distance * Math.pow(data.phase_spacing, 3), 1 / 4) : Math.pow(data.cross_arm_distance * data.phase_spacing.reduce((a, b) => a * b), 1 / 4);
      // console.log("D: ", D);
      let dcv = data.surface_factor * density_factor * dcv_gradient * r * Math.log(dm / r);
      dcv = dcv * 1e-3;
      console.log("dcv: ", dcv);
      let corona_loss = (244 / density_factor) * (data.frequency + 25) * Math.pow(phase_voltage - dcv, 2) * Math.sqrt(r / dm) * 1e-5;
      console.log("Corona Loss: ", corona_loss);

      const Vr = phase_voltage * 1e3;
      const power_mw = data.power * 2 * data.power_factor;
      const Ir = power_mw * 1e6 / (Math.sqrt(3) * data.voltage * 1e3 * data.power_factor);

      console.log("Ir: ", Ir);

      let R = null;
      if (isNaN(data.resistance)) {
        R = ResistanceData.find(r => r.currentat40 >= Ir).resistance;
        R = (228.1 + round(data.max_temperature + 10)) / (228.1 + 20) * R;
      }
      else R = data.resistance;
      R = R * data.line_length;
      console.log("R: ", R, "Rounded Max Temp: ", round(data.max_temperature + 10));
      const Z = complex(R, Xl);
      const Y = complex(0, 1 / Xc);
      console.log("Z: ", Z, "Y: ", Y);

      // Calculate A, B, C
      const A = add(1, divide(multiply(Z, Y), 2));
      const B = Z; // Z is already a complex number
      const C = add(Y, divide(multiply(pow(Y, 2), Z), 4));

      // Log results
      console.log("Z: ", Z.toString(), "Y: ", Y.toString());
      console.log("A: ", A.toString(), "B: ", B.toString(), "C: ", C.toString());

      // Perform the multiplication [Vs, Is] = [[A, B], [C, A]] * [Vr, Ir]
      const Vs = add(multiply(A, Vr), multiply(B, Ir));
      const Is = add(multiply(C, Vr), multiply(A, Ir));
      console.log("Vs: ", Vs.toString(), "Is: ", Is.toString());

      // Calculate VR and efficiency
      const VR_nl = abs(Vs) / abs(A);
      console.log("VR_nl: ", VR_nl, "abs(A): ", abs(A), "abs(Vs): ", abs(Vs));
      const VR_fl = Vr;
      const VR = ((VR_nl - VR_fl) / VR_nl) * 100;
      console.log("VR: ", VR);

      const pf_new = cos(arg(Vs) - arg(Is)); // Power factor
      console.log("Power Factor: ", pf_new, "arg(Vs): ", arg(Vs), "arg(Is): ", arg(Is));
      const Ps = (3 * abs(Vs) * abs(Is) * pf_new) / 1e6; // Sending power

      const n = (power_mw / Ps) * 100; // Efficiency
      setOutput({
        corona_loss,
        VR,
        n,
        R,
        Xl,
        Xc,
      })
      console.log({ corona_loss, VR, n });
      setTimeout(() => {
        setLoading(false);
        window.scrollTo(document.body.scrollHeight, 0);
      }, 1000);
    } catch (error) {
      console.log(error);
      setError("An error occured while processing the data. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center gap-10">
      {
        output &&
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex items-center justify-center'>
          <div className='flex items-center justify-center w-full h-full relative'>
            <div className='bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-[500px]'>
              <h1 className='text-4xl font-bold text-center pb-10'>Results</h1>
              <div className='flex flex-col gap-5'>
                <div className='flex items-center justify-around gap-5'>
                  <p className='font-bold'>Corona Loss</p>
                  <p>{output.corona_loss.toFixed(2)} kW/km/phase</p>
                </div>
                <div className='flex items-center justify-around gap-5'>
                  <p className='font-bold'>Voltage Regulation</p>
                  <p>{output.VR.toFixed(2)} %</p>
                </div>
                <div className='flex items-center justify-around gap-5'>
                  <p className='font-bold'>Efficiency</p>
                  <p>{output.n.toFixed(4)} %</p>
                </div>
                <div className='flex items-center justify-around gap-5'>
                  <p className='font-bold'>Resistance</p>
                  <p>{output.R.toFixed(4)} Ω</p>
                </div>
                <div className='flex items-center justify-around gap-5'>
                  <p className='font-bold'>Inductive Reactance</p>
                  <p>{output.Xl.toFixed(4)} Ω</p>
                </div>
                <div className='flex items-center justify-around gap-5'>
                  <p className='font-bold'>Capacitive Reactance</p>
                  <p>{output.Xc.toFixed(4)} Ω</p>
                </div>
              </div>
              <button onClick={() => setOutput(null)} className='bg-gray-800 p-2 rounded-full flex items-center justify-center absolute top-4 right-4'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      }
      <h1 className="text-4xl font-extrabold font-mono text-center">DOUBLE CIRCUIT SYSTEM</h1>
      <form className="flex flex-col gap-12" onSubmit={handleSubmit}>
        <p className="font-mono">Enter the following parameters to get started:</p>

        <div className="flex flex-col gap-6">
          <p className="text-2xl font-bold underline underline-offset-4">System Parameters</p>
          <div className='flex flex-wrap gap-5 items-center justify-center'>
            <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
              <label htmlFor="voltage" className="font-bold">Voltage</label>
              <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                <input required min={0} step={0.0001} type="number" name="voltage" placeholder="(kV)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
              </div>
            </div>

            <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
              <label htmlFor="frequency" className="font-bold">Frequency</label>
              <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                <input required min={0} step={0.0001} type="number" name="frequency" placeholder="(Hz)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
              </div>
            </div>

            <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
              <label htmlFor="power" className="font-bold">Power</label>
              <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                <input required min={0} step={0.0001} type="number" name="power" placeholder="(MVA)" className="border-none placeholder:text-gray-300 placeholder:text-xs focus:outline-none bg-transparent flex-1" />
              </div>
            </div>

            <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
              <label htmlFor="power_factor" className="font-bold">Power Factor</label>
              <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                <input required min={0} step={0.0001} type="number" name="power_factor" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
              </div>
            </div>

            <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
              <label htmlFor="line_length" className="font-bold">Line Length</label>
              <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                <input required min={0} step={0.0001} type="number" name="line_length" placeholder="(km)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
              </div>
            </div>

            <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
              <label htmlFor="diameter" className="font-bold">Diameter</label>
              <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                <input required type="number" min={0} step={0.000001} name="diameter" placeholder="(m)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
              </div>
            </div>

            <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
              <label htmlFor="resistance" className="font-bold">Resistance</label>
              <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                <input type="number" min={0} step={0.00001} name="resistance" placeholder="(Ω/km)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
              </div>
            </div>

            <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
              <label htmlFor="inductive_reactance" className="font-bold">Inductive Reactance</label>
              <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                <input type="number" min={0} step={0.00001} name="inductive_reactance" placeholder="(Ω/km)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" onBlur={(e) => e.target.value ? setIsInductanceProvided(true) : setIsInductanceProvided(false)} />
              </div>
            </div>

            <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
              <label htmlFor="capacitive_reactance" className="font-bold">Capacitive Reactance</label>
              <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                <input type="number" min={0} step={0.000000000001} name="capacitive_reactance" placeholder="(Ω/km)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" onBlur={(e) => e.target.value ? setIsCapacitanceProvided(true) : setIsCapacitanceProvided(false)} />
              </div>
            </div>
          </div>
        </div>

        {(!isCapacitanceProvided || !isInductanceProvided) &&
          <div className="flex flex-col gap-6">
            <p className="text-2xl font-bold underline underline-offset-4">For Inductance & Capacitance</p>
            <div className="flex flex-wrap gap-5 items-center justify-center">
              <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
                <label htmlFor="number_of_bundled_conductors" className="font-bold">Number of Bundled Conductors</label>
                <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                  <input required type="number" min={2} max={4} step={1} name="number_of_bundled_conductors" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
                </div>
              </div>

              <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
                <label htmlFor="bundle_spacing" className="font-bold">Bundle Spacing</label>
                <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                  <input required min={0} step={0.0001} type="number" name="bundle_spacing" placeholder="(m)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
                </div>
              </div>

              <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
                <label htmlFor="self_distance" className="font-bold">Self Distance</label>
                <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                  <input required type="text" pattern="^[0-9.,]*$" name="self_distance" placeholder="(m)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" onInput={(e) => e.target.setCustomValidity(e.target.validity.patternMismatch ? "Please enter a comma separated list of numbers" : "")} />
                  <span className="cursor-pointer relative group">
                    <div className="hidden absolute group-hover:block -top-24 right-0 bg-gray-100 text-black p-2 rounded-lg shadow-lg w-[250px]">
                      <p>Seperate the self distance of all phases &quot;A-A&apos;, B-B&apos;, C-C&apos;&quot; by a comma &quot;,&quot; for each phase. </p>
                    </div>
                    <IoInformation size={18} className="text-gray-600 bg-white rounded-full flex items-center justify-center p-[2px]" />
                  </span>
                  <span className='cursor-pointer relative group'>
                    <div className="hidden absolute group-hover:flex -top-20 right-0 bg-gray-100 text-black p-2 rounded-lg shadow-lg w-[250px] items-center justify-center">
                      <Image src="/images/self_distance.jpg" width={200} height={100} alt="Self Distance Formula" className='object-contain mix-blend-darken' />
                    </div>
                    <RiFormula size={18} className="text-gray-600 bg-white rounded-full flex items-center justify-center p-[2px]" />
                  </span>
                </div>
              </div>


              <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
                <label htmlFor="distance_between_phases" className="font-bold">Distance between Phases</label>
                <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                  <input required type="text" pattern="^[0-9.,]*$" name="distance_between_phases" placeholder="(m)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" onInput={(e) => e.target.setCustomValidity(e.target.validity.patternMismatch ? "Please enter a comma separated list of numbers" : "")} />
                  <span className="cursor-pointer relative group">
                    <div className="hidden absolute group-hover:block -top-24 right-0 bg-gray-100 text-black p-2 rounded-lg shadow-lg w-[250px]">
                      <p>Seperate the distance between phases &quot;AB, BC, CA&quot; by a comma &quot;,&quot;. </p>
                    </div>
                    <IoInformation size={18} className="text-gray-600 bg-white rounded-full flex items-center justify-center p-[2px]" />
                  </span>
                  <span className="cursor-pointer relative group">
                    <div className="hidden absolute group-hover:flex -top-20 right-0 bg-gray-100 text-black p-2 rounded-lg shadow-lg w-[250px] items-center justify-center">
                      <Image src="/images/distance_between_phases.jpg" width={200} height={120} alt="Distance between Phases Formula" className='object-contain mix-blend-darken' />
                    </div>
                    <RiFormula size={18} className="text-gray-600 bg-white rounded-full flex items-center justify-center p-[2px]" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        }

        <div className="flex flex-col gap-6">
          <p className="text-2xl font-bold underline underline-offset-4">For Corona Loss</p>
          <div className="flex flex-wrap gap-5 items-center justify-center">
            <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
              <label htmlFor='pressure' className='font-bold'>Pressure</label>
              <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                <input required min={0} step={0.0001} type="number" name="pressure" placeholder="(mm of Hg)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
              </div>
            </div>

            <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
              <label htmlFor='temperature' className='font-bold'>Temperature</label>
              <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                <input required min={0} step={0.0001} type="number" name="temperature" placeholder="(°C)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
              </div>
            </div>

            <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
              <label htmlFor='max_temperature' className='font-bold'>Max. Temperature</label>
              <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                <input required min={0} step={0.0001} type="number" name="max_temperature" placeholder="(°C)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
              </div>
            </div>

            <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
              <label htmlFor='surface_factor' className='font-bold'>Surface Factor</label>
              <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                <input required min={0} step={0.0001} type="number" name="surface_factor" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
                <span className='cursor-pointer relative group'>
                  <div className="hidden group-hover:block absolute -top-28 right-0 bg-gray-100 text-black p-2 rounded-lg shadow-lg w-[250px]">
                    <p>Surface factor or irregularity factor or roughness factor is the ratio of the actual surface area to the projected surface area.</p>
                  </div>
                  <IoInformation size={18} className="text-gray-600 bg-white rounded-full flex items-center justify-center p-[2px]" />
                </span>
              </div>
            </div>

            <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
              <label htmlFor='cross_arm_distance' className='font-bold'>Cross Arm Distance</label>
              <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                <input min={0} step={0.0001} type="number" name="cross_arm_distance" placeholder="(m)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
              </div>
            </div>

            <div className='flex flex-col gap-2 basis-64 max-w-[450px] flex-1'>
              <label htmlFor='phase_spacing' className='font-bold'>Phase Spacing</label>
              <div className="p-2 border-b-2 border-white flex items-center gap-2 has-[:focus]:bg-white/20">
                <input required type="text" pattern="^[0-9.,]*$" name="phase_spacing" placeholder="(m)" className="border-none placeholder:text-gray-300 focus:outline-none bg-transparent flex-1" />
                <span className="cursor-pointer relative group" onInput={(e) => e.target.setCustomValidity(e.target.validity.patternMismatch ? "Please enter a comma separated list of numbers" : "")}>
                  <div className="hidden group-hover:block absolute -top-24 right-0 bg-gray-100 text-black p-2 rounded-lg shadow-lg w-[250px]">
                    <p>If unsymmetric, seperate phase spacing by a comma &quot;,&quot; for all phases in the sequence of &quot;A-B, B-C, C-A&quot;</p>
                  </div>
                  <IoInformation size={18} className="text-gray-600 bg-white rounded-full flex items-center justify-center p-[2px]" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <button type="submit" disabled={loading} className="border border-white text-white p-2 rounded-3xl flex items-center justify-center text-center w-full max-w-80 mx-auto">{loading ? <div className="w-5 h-5 border-t-2 border-b-2 border-gray-100 rounded-full animate-spin"></div> : "Calculate"}</button>
      </form>
      {error && <p className="text-red-300 text-xs text-center">{error}</p>}
    </div >
  );
}