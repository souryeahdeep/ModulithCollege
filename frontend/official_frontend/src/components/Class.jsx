export default function Class({stream,subject,group,section,timing,status}) {
  return (
    <div class="bg-blue-100 p-5 text-left">
      <h1>Stream : {stream}</h1>
      <h1>Subject : {subject}</h1>
      <h1> Group : {group}</h1>
      <h1> Section {section}</h1>
      <div className="flex justify-between">
        <h1>{timing}</h1>
        <h1 className="text-green-400">{status}</h1>
      </div>
    </div>
  );
}
