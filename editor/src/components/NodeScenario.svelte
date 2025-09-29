<script lang="ts">
  import Connector from 'components/Connector.svelte';
  import Image from 'components/Image.svelte';
  import { ResizeImage } from 'helpers/ResizeImage';
  import { Editor, Language, type Node } from 'state/Editor.svelte';
  import { Lang } from 'state/Lang.svelte';
  import { User } from 'state/User.svelte';

  let { data, wiringStart }: {
    data: Node;
    wiringStart: (node: Node) => (e: PointerEvent) => void;
  } = $props();

  const updateName = (value: string) => {
    Editor.update({
      setScenarioName: {
        id: data.id!,
        value,
      },
    });
  };

  const updateDescription = (value: string) => {
    Editor.update({
      setScenarioDescription: {
        id: data.id!,
        value,
      },
    });
  };

  const updateLanguage = (value: Language) => {
    Editor.update({
      setScenarioLanguage: {
        id: data.id!,
        value,
      },
    });
  };

  const browsePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.oncancel = () => {
      input.oncancel = null;
      input.onchange = null;
    };
    input.onchange = () => {
      if (!input.files?.length) {
        return;
      }
      updatePhoto(input.files[0]);
    };
    input.click();
  };

  const dropPhoto = (e: DragEvent) => {
    if (!e.dataTransfer?.files.length) {
      return;
    }
    updatePhoto(e.dataTransfer.files[0]);
  };

  const updatePhoto = async (file: File) => {
    if (!file || file.type.substring(0, 6) !== 'image/') {
      return;
    }
    Editor.update({
      setScenarioPhoto: {
        id: data.id!,
        value: await ResizeImage(file, { x: 128, y: 128 }),
      },
    });
  };

  const updatePrivate = (value: boolean) => {
    Editor.update({
      setScenarioPrivate: {
        id: data.id!,
        value,
      },
    });
  };

  const addCollaborator = () => {
    Editor.addingCollaborator = data.id!;
  };

  const removeCollaborator = (username: string) => () => {
    Editor.update({
      removeScenarioCollaborator: {
        id: data.id!,
        value: username,
      },
    });
  };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="photo" ondrop={dropPhoto}>
  <div class="image">
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button onclick={browsePhoto}>
      <svg width="2rem" height="2rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 16V3M12 3L16 7.375M12 3L8 7.375"  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <Image data={data.scenario!.photo!} />
  </div>
</div>
<!-- svelte-ignore a11y_label_has_associated_control -->
<label>{Lang.current.name}</label>
<div class="connection">
  <input
    type="text"
    spellcheck={false}
    value={data.scenario!.name!}
    oninput={({ currentTarget: { value } }) => updateName(value)}
  />
  <Connector
    position="right"
    onpointerdown={wiringStart(data)}
  />
</div>
<!-- svelte-ignore a11y_label_has_associated_control -->
<label>{Lang.current.description}</label>
<div>
  <input
    type="text"
    spellcheck={false}
    value={data.scenario!.description}
    oninput={({ currentTarget: { value } }) => updateDescription(value)}
  />
</div>
<!-- svelte-ignore a11y_label_has_associated_control -->
<label>{Lang.current.language}</label>
<select
  value={data.scenario!.language!}
  onchange={({ currentTarget: { value } }) => updateLanguage(parseInt(value, 10))}
>
  <option value={Language.AA}>Afar</option>
  <option value={Language.AF}>Afrikaans</option>
  <option value={Language.SQ}>Albanian</option>
  <option value={Language.AM}>Amharic</option>
  <option value={Language.AR}>Arabic</option>
  <option value={Language.HY}>Armenian</option>
  <option value={Language.AY}>Aymara</option>
  <option value={Language.AZ}>Azerbaijani</option>
  <option value={Language.BE}>Belarusian</option>
  <option value={Language.BN}>Bengali</option>
  <option value={Language.BI}>Bislama</option>
  <option value={Language.BS}>Bosnian</option>
  <option value={Language.BG}>Bulgarian</option>
  <option value={Language.MY}>Burmese</option>
  <option value={Language.CA}>Catalan</option>
  <option value={Language.CH}>Chamorro</option>
  <option value={Language.NY}>Chichewa</option>
  <option value={Language.ZH}>Chinese</option>
  <option value={Language.HR}>Croatian</option>
  <option value={Language.CS}>Czech</option>
  <option value={Language.DA}>Danish</option>
  <option value={Language.DV}>Divehi</option>
  <option value={Language.NL}>Dutch</option>
  <option value={Language.DZ}>Dzongkha</option>
  <option value={Language.EN}>English</option>
  <option value={Language.ET}>Estonian</option>
  <option value={Language.FO}>Faroese</option>
  <option value={Language.FJ}>Fijian</option>
  <option value={Language.FI}>Finnish</option>
  <option value={Language.FR}>French</option>
  <option value={Language.FF}>Fula</option>
  <option value={Language.KA}>Georgian</option>
  <option value={Language.DE}>German</option>
  <option value={Language.EL}>Greek</option>
  <option value={Language.KL}>Greenlandic</option>
  <option value={Language.GN}>Guaraní</option>
  <option value={Language.HT}>Haitian</option>
  <option value={Language.HE}>Hebrew</option>
  <option value={Language.HI}>Hindi</option>
  <option value={Language.HU}>Hungarian</option>
  <option value={Language.IS}>Icelandic</option>
  <option value={Language.ID}>Indonesian</option>
  <option value={Language.GA}>Irish</option>
  <option value={Language.IT}>Italian</option>
  <option value={Language.JA}>Japanese</option>
  <option value={Language.KK}>Kazakh</option>
  <option value={Language.KM}>Khmer</option>
  <option value={Language.RW}>Kinyarwanda</option>
  <option value={Language.RN}>Kirundi</option>
  <option value={Language.KG}>Kongo</option>
  <option value={Language.KO}>Korean</option>
  <option value={Language.KU}>Kurdish</option>
  <option value={Language.KY}>Kyrgyz</option>
  <option value={Language.LO}>Lao</option>
  <option value={Language.LA}>Latin</option>
  <option value={Language.LV}>Latvian</option>
  <option value={Language.LN}>Lingala</option>
  <option value={Language.LT}>Lithuanian</option>
  <option value={Language.LU}>Luba-Katanga</option>
  <option value={Language.LB}>Luxembourgish</option>
  <option value={Language.MK}>Macedonian</option>
  <option value={Language.MG}>Malagasy</option>
  <option value={Language.MS}>Malay</option>
  <option value={Language.MT}>Maltese</option>
  <option value={Language.GV}>Manx</option>
  <option value={Language.MH}>Marshallese</option>
  <option value={Language.MN}>Mongolian</option>
  <option value={Language.MI}>Māori</option>
  <option value={Language.NA}>Nauruan</option>
  <option value={Language.NE}>Nepali</option>
  <option value={Language.ND}>Northern Ndebele</option>
  <option value={Language.NO}>Norwegian</option>
  <option value={Language.NB}>Norwegian Bokmål</option>
  <option value={Language.NN}>Norwegian Nynorsk</option>
  <option value={Language.PS}>Pashto</option>
  <option value={Language.FA}>Persian</option>
  <option value={Language.PL}>Polish</option>
  <option value={Language.PT}>Portuguese</option>
  <option value={Language.PA}>Punjabi</option>
  <option value={Language.QU}>Quechua</option>
  <option value={Language.RO}>Romanian</option>
  <option value={Language.RM}>Romansh</option>
  <option value={Language.RU}>Russian</option>
  <option value={Language.SM}>Samoan</option>
  <option value={Language.SG}>Sango</option>
  <option value={Language.SR}>Serbian</option>
  <option value={Language.SN}>Shona</option>
  <option value={Language.SI}>Sinhalese</option>
  <option value={Language.SK}>Slovak</option>
  <option value={Language.SL}>Slovene</option>
  <option value={Language.SO}>Somali</option>
  <option value={Language.NR}>Southern Ndebele</option>
  <option value={Language.ST}>Southern Sotho</option>
  <option value={Language.ES}>Spanish</option>
  <option value={Language.SW}>Swahili</option>
  <option value={Language.SS}>Swati</option>
  <option value={Language.SV}>Swedish</option>
  <option value={Language.TG}>Tajik</option>
  <option value={Language.TA}>Tamil</option>
  <option value={Language.TH}>Thai</option>
  <option value={Language.TI}>Tigrinya</option>
  <option value={Language.TO}>Tonga</option>
  <option value={Language.TS}>Tsonga</option>
  <option value={Language.TN}>Tswana</option>
  <option value={Language.TR}>Turkish</option>
  <option value={Language.TK}>Turkmen</option>
  <option value={Language.UK}>Ukrainian</option>
  <option value={Language.UR}>Urdu</option>
  <option value={Language.UZ}>Uzbek</option>
  <option value={Language.VE}>Venda</option>
  <option value={Language.VI}>Vietnamese</option>
  <option value={Language.XH}>Xhosa</option>
  <option value={Language.ZU}>Zulu</option>
</select>
<!-- svelte-ignore a11y_label_has_associated_control -->
<label>{Lang.current.privacy}</label>
<div class="options">
  <label class="option" data-no-drag>
    <input
      name="private"
      type="radio"
      checked={!data.scenario!.private}
      value={false}
      onchange={({ currentTarget: { checked } }) => updatePrivate(!checked)}
    />
    <div>
      {Lang.current.public}
    </div>
  </label>
  <label class="option" data-no-drag>
    <input
      name="private"
      type="radio"
      checked={data.scenario!.private}
      value={true}
      onchange={({ currentTarget: { checked } }) => updatePrivate(checked)}
    />
    <div>
      {Lang.current.private}
    </div>
  </label>
</div>
<!-- svelte-ignore a11y_label_has_associated_control -->
<label>{Lang.current.creator}</label>
<div class="user">
  {data.scenario!.creator}
</div>
<!-- svelte-ignore a11y_label_has_associated_control -->
<label class="add">
  {Lang.current.collaborators}
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button onclick={addCollaborator}>
    <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 12L12 12M12 12L17 12M12 12V7M12 12L12 17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</label>
<div class="collaborators">
  {#each data.scenario!.collaborators! as collaborator}
    <div class="collaborator">
      <div class="user">
        {collaborator}
      </div>
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button
        disabled={collaborator === User.name}
        onclick={removeCollaborator(collaborator)}
      >
        <svg width="1rem" height="1rem" viewBox="-6.5 -3 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"/>
        </svg>
      </button>
    </div>
  {:else}
    <div class="empty">
      {Lang.current.emptyCollaborators}
    </div>
  {/each}
</div>
<div class="link">
  <a href={`${__CLIENT__}#/${Editor.id}`} rel="noopener noreferrer" target="_blank" data-no-drag>
    <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 9L21 3M21 3H15M21 3L13 11M10 5H7.8C6.11984 5 5.27976 5 4.63803 5.32698C4.07354 5.6146 3.6146 6.07354 3.32698 6.63803C3 7.27976 3 8.11984 3 9.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7202 19 17.8802 19 16.2V14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    {Lang.current.preview}
  </a>
</div>

<style>
  .connection {
    position: relative;
  }

  .photo {
    display: grid;
    justify-content: center;
  }

  .image {
    width: 8rem;
    height: 8rem;
    border: 4px solid #222;
    border-radius: 8rem;
    overflow: hidden;
    position: relative;
  }

  .image > button {
    display: none;
    width: 8rem;
    height: 8rem;
    border: 0;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.95;
  }

  .image:hover > button {
    display: flex;
  }

  .options {
    display: grid;
    gap: 0.25rem;
    justify-items: flex-start;
  }
  
  .option {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    color: #eee;
    cursor: pointer;
  }

  .option > div {
    padding-right: 0.5rem;
    pointer-events: none;
  }

  .user {
    padding: 0 0.5rem;
  }

  .add {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .add > button {
    color: #eee;
    padding: 0;
  }

  .empty {
    display: grid;
    justify-content: center;
    color: #666;
    padding: 0.5rem 0;
  }

  .collaborators {
    display: grid;
    align-content: flex-start;
    gap: 0.25rem;
  }

  .collaborator {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
  }

  .collaborator > button {
    display: none;
    padding: 0;
  }

  .collaborator:hover > button {
    display: flex;
  }
  
  .link {
    display: grid;
    justify-items: flex-start;
  }

  .link > a {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    align-items: center;
  }
</style>
