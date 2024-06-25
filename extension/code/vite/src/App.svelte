<script lang="ts">
  import { onMount } from "svelte";
  import Card from "./lib/Card.svelte";
  import OptionPicker from "./lib/OptionPicker.svelte";
  import Advanced from "./lib/Settings/Advanced.svelte";
  import Output from "./lib/Settings/Output.svelte";
  import Scrolling from "./lib/Settings/Scrolling.svelte";
  import Settings from "./lib/Settings/SettingsContainer";
  import { slide } from "svelte/transition";
  import Icon from "./assets/icon.svg";
  /**
   * The settings section shown
   */
  $: section = "output";
  /**
   * If the script has been started or not
   */
  $: isConverting = false;
  /**
   * A value that indicates if it's the first time the "Settings" edit callback is called.
   * This callback is done only when initializing the variable, so there's no need to save it in the extension storage.
   */
  let isFirstEvent = true;
  let isAuthorizedForTikTok = true;
  Settings.subscribe((settingUpdate) => {
    if (isFirstEvent) {
      isFirstEvent = false;
      return;
    }
    (chrome ?? browser).storage.sync.set({ settings: settingUpdate });
  });
  /**
   * Checks if the extension is authorized to access TikTok website
   */
  async function checkPermission() {
    isAuthorizedForTikTok = await (chrome ?? browser).permissions.contains({
      origins: ["*://*.tiktok.com/*"],
    });
  }
  onMount(() => {
    /**
     * Update an Object by getting a JSON value, also for nested properties
     * @param json the object where the values will be taken
     * @param update the object to replace
     */
    function UpdateJsonProperties(json: any, update: any) {
      // @ts-ignore
      for (let key in json) {
        typeof json[key] === "object"
          ? UpdateJsonProperties(json[key], update[key])
          : (update[key] = json[key]);
      }
      return update;
    }
    checkPermission();
    (chrome ?? browser).storage.sync
      .get("settings")
      .then(
        (obj) => ($Settings = UpdateJsonProperties(obj.settings, $Settings)),
      );

    (chrome ?? browser).runtime.onMessage.addListener(
      (msg) => (isConverting = msg.operation), // Currently, messages from the content_script are sent only when the value of the operation changes
    );
    sendMessage({ action: "requestOperation", content: "" }); // Asks if there's a script operation ongoing.
  });
  interface MessageProps {
    action: string;
    content: any;
  }
  /**
   * This function will replace some values that are stored in the extension settings in a different way.
   */
  function fixOutput() {
    let output = { ...$Settings };
    if (output.output_name_type === -1)
      output.output_name_type = $Settings.__extension
        .fileName as unknown as number; // It's actually a string, but the script will handle that.
    if (output.advanced.maximum_downloads < 0)
      output.advanced.maximum_downloads = Infinity; // This will become "null" when passed, but the script will handle that.
    return output;
  }
  /**
   * Send a message to the content script
   * @param msg the message to send
   */
  async function sendMessage(msg: MessageProps) {
    const ids = await (chrome ?? browser).tabs.query({ active: true });
    (chrome ?? browser).tabs.sendMessage(ids[0].id as number, msg);
  }
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href={Icon} />
</svelte:head>

<header class="flex hcenter wcenter" style="gap: 5px">
  <img width="48" height="48" src={Icon} alt="tiktok-to-ytdlp icon" />
  <h1>tiktok-to-ytdlp</h1>
</header>
<br />
{#if !isAuthorizedForTikTok}
  <Card type={2}>
    <h2>You need to grant TikTok access authorization</h2>
    <p>Without it, tiktok-to-ytdlp won't be able to read the webpage.</p>
    <br />
    <button
      on:click={async () => {
        await (chrome ?? browser).permissions.request({
          origins: ["*://*.tiktok.com/*"],
        });
        checkPermission();
      }}>Grant authorization</button
    >
  </Card><br />
{/if}
{#if !isConverting}
  <div in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
    <OptionPicker
      on:changeSection={({ detail }) => (section = detail)}
      providedOptions={[
        { id: "output", text: "Output file settings", selected: true },
        { id: "scrollTime", text: "Scrolling time" },
        { id: "advanced", text: "Advanced settings" },
      ]}
    ></OptionPicker><br />
    {#if section === "output"}
      <Output></Output>
    {:else if section === "scrollTime"}
      <Scrolling></Scrolling>
    {:else if section === "advanced"}
      <Advanced></Advanced>
    {/if}<br />
    <Card>
      <label class="flex hcenter autoGap">
        <input
          type="checkbox"
          bind:value={$Settings.delete_from_next_txt}
          style="background-color: var(--input);"
        />
        Delete the previously-fetched items from partial .txt downloads
      </label><br /><br />
      <button
        on:click={() => sendMessage({ action: "start", content: fixOutput() })}
        >Start video fetching</button
      >
    </Card>
  </div>
{:else}
  <div in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
    <h2>Converting items...</h2>
    <button on:click={() => sendMessage({ action: "partial", content: "" })}
      >Get partial .txt file</button
    ><br />
    <i>To stop this operation, refresh the page.</i>
  </div>
{/if}<br /><br />
<p>
  Icons from <a href="https://github.com/microsoft/fluentui-system-icons/"
    >Microsoft's Fluent UI System Icons</a
  ><br />This project is not affiliated or endorsed in any way with TikTok,
  which is a trademark and a product of ByteDance.
</p>
