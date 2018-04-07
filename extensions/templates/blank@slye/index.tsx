export default class BlankTemplate extends Template {
  async attach() {
    // preload a 3D object.
    // set a requestAnimationFrame handler.
  }

  async detach() {
    // remove requestAnimationFrame handler.
  }

  render() {
    return (
      <Group>
        <Sun />
      </Group>
    );
  }
}
