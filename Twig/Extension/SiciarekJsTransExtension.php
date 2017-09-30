<?php

namespace Siciarek\JsTransBundle\Twig\Extension;

use Symfony\Bundle\FrameworkBundle\Templating\Helper\AssetsHelper;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Translation\Translator;

class SiciarekJsTransExtension extends \Twig_Extension
{
    /**
     * @var Translator
     */
    protected $translator;
    /**
     * @var \Twig_Environment
     */
    protected $twig;
    /**
     * @var string
     */
    protected $translationsDir;
    /**
     * @var callable
     */
    protected $assetFunction;

    public function __construct(Translator $translator, \Twig_Environment $twig, $translationsDir)
    {
        $this->translator = $translator;
        $this->twig = $twig;
        $this->translationsDir = $translationsDir;
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'siciarek_js_trans_twig_extension';
    }

    /**
     * Filters declaration
     */
    public function getFilters()
    {
        return [];
    }

    /**
     * Functions declaration
     */
    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction('translations', [$this, 'translations'], ['is_safe' => ['html']]),
        ];
    }

    /**
     * Translations helper
     *
     * @param $currlocale
     * @param array $locs
     * @return string
     */
    public function translations($currlocale, $locs = [])
    {
        if (!in_array($currlocale, $locs)) {
            $locs[] = $currlocale;
        }

        # Just building translation catalogues for all the languages in $loc
        foreach ($locs as $loc) {
            $this->translator->trans(null, [], null, $loc);
        }

        $finder = new Finder();
        $files = $finder->files()->in($this->translationsDir)->name('/\.php$/');

        $catalogues = [];

        foreach ($files as $file) {
            $script = $file->getRealPath();
            $loc = preg_replace('/.*catalogue\.([^\.]+)\..*/', '$1', $script);

            /**
             * @var \Symfony\Component\Translation\MessageCatalogue $catalogue
             */
            $catalogue = require $script;
            $catalogues[$loc] = $catalogue->all();
        }

        $translations = json_encode($catalogues);
        $xregexpJs = $this->asset('bundles/siciarekjstrans/js/lib/xregexp.min.js');
        $transJs = $this->asset('bundles/siciarekjstrans/js/dist/trans.min.js');

        return <<<ASSETS
<script>String.prototype.locale = '{$currlocale}';</script>
    <script>String.prototype.translations = {$translations};</script>
    <script src="{$xregexpJs}"></script>
    <script src="{$transJs}"></script>
ASSETS;

    }

    /**
     * Asset function wrapper
     *
     * @param $asset
     * @return mixed
     */
    protected function asset($asset)
    {
        if (empty($this->assetFunction)) {
            $this->assetFunction = $this->twig->getFunction('asset')->getCallable();
        }

        return call_user_func($this->assetFunction, $asset);
    }
}
