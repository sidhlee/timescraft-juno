export const mobs = [
  {
    name: 'Pig',
    difficulty: 1,
    src: './assets/images/mobs/pig.png',
    size: 'md',
  },
  {
    name: 'Cow',
    difficulty: 2,
    src: './assets/images/mobs/cow.png',
    size: 'md',
  },
  {
    name: 'White Sheep',
    difficulty: 3,
    src: './assets/images/mobs/white-sheep.png',
    size: 'md',
  },
  {
    name: 'Chicken',
    difficulty: 4,
    src: './assets/images/mobs/chicken.png',
    size: 'sm',
  },
  {
    name: 'Salmon',
    difficulty: 5,
    src: './assets/images/mobs/salmon.png',
    size: 'sm',
  },
  {
    name: 'White Rabbit',
    difficulty: 6,
    src: './assets/images/mobs/white-rabbit.png',
    size: 'sm',
  },
  {
    name: 'Bee',
    difficulty: 7,
    src: './assets/images/mobs/bee.png',
    size: 'sm',
  },
  {
    name: 'Squid',
    difficulty: 8,
    src: './assets/images/mobs/squid.png',
    size: 'lg',
  },
  {
    name: 'Bat',
    difficulty: 9,
    src: './assets/images/mobs/bat.png',
    size: 'sm',
  },
  {
    name: 'Black Horse',
    difficulty: 10,
    src: './assets/images/mobs/black-horse.png',
    size: 'md',
  },
  {
    name: 'Turtle',
    difficulty: 11,
    src: './assets/images/mobs/turtle.png',
    size: 'lg',
  },
  {
    name: 'Dolphin',
    difficulty: 12,
    src: './assets/images/mobs/dolphin.png',
    size: 'lg',
  },
  {
    name: 'Llama',
    difficulty: 13,
    src: './assets/images/mobs/llama.png',
    size: 'lg',
  },
  {
    name: 'Zombie',
    difficulty: 14,
    src: './assets/images/mobs/zombie.png',
    size: 'lg',
  },
  {
    name: 'Spider',
    difficulty: 15,
    src: './assets/images/mobs/spider.png',
    size: 'lg',
  },
  {
    name: 'Skeleton',
    difficulty: 16,
    src: './assets/images/mobs/skeleton.png',
    size: 'lg',
  },
  {
    name: 'Baby Zombie',
    difficulty: 17,
    src: './assets/images/mobs/baby-zombie.png',
    size: 'md',
  },

  {
    name: 'Slime',
    difficulty: 18,
    src: './assets/images/mobs/slime.png',
    size: 'md',
  },
  {
    name: 'Wither Skeleton',
    difficulty: 19,
    src: './assets/images/mobs/wither-skeleton.png',
    size: 'lg',
  },
  {
    name: 'Witch',
    difficulty: 20,
    src: './assets/images/mobs/witch.png',
    size: 'md',
  },
  {
    name: 'Polar Bear',
    difficulty: 21,
    src: './assets/images/mobs/polar-bear.png',
    size: 'lg',
  },
  {
    name: 'Creeper',
    difficulty: 22,
    src: './assets/images/mobs/creeper.png',
    size: 'lg',
  },
  {
    name: 'Enderman',
    difficulty: 23,
    src: './assets/images/mobs/enderman.png',
    size: 'xl',
  },
  {
    name: 'Gast',
    difficulty: 24,
    src: './assets/images/mobs/gast.png',
    size: 'lg',
  },
  {
    name: 'Wither',
    difficulty: 25,
    src: './assets/images/mobs/wither.png',
    size: 'xl',
  },
];

export default class Mob {
  /**
   * create a new mob with given difficulty
   * @param {number} difficulty
   */
  constructor(difficulty) {
    this.mob = mobs.find((mob) => mob.difficulty === difficulty);
  }
  show() {
    $('.mob > img')
      .attr('src', this.mob.src)
      .one('load', () => {
        const $mob = $('.mob');
        $mob
          .one('animationend', function (e) {
            e.stopPropagation();
            $mob.removeClass(
              'animate__animated animate__slideInLeft animate__faster'
            );
          })
          .css('opacity', 1)
          .removeClass('mob-sm mob-md mob-lg mob-xl')
          .addClass(`mob-${this.mob.size}`)
          .addClass('animate__animated animate__slideInLeft animate__faster');
      });
  }
}
